<template>
    <v-group ref="rectsGroup">
        <v-rect v-for="item in rectsList" :key="item.name" :config="item"
                @mouseenter="handleRectMouseEnter" @mouseleave="handleRectMouseLeave"></v-rect>
        <v-transformer ref="transformer" :config="transformer"
                       @transform="handleTransform"></v-transformer>
    </v-group>
</template>

<script>
    import {rectColors, rectConfig, transformerConfig, getStageCoordsRange} from './Rects.module'

    export default {
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            index: {
                type: Number,
                default: 0
            },
            selected: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                rectColors: rectColors,
                transformer: transformerConfig,
                cursorStyle: 'default'
            };
        },
        computed: {
            rectsList() {
                const selectColor = this.rectColors[this.index];
                const selectStyle = {};
                if (selectColor) {
                    selectStyle.fill = selectColor;
                }
                return this.list.map(item => Object.assign(item, rectConfig, selectStyle));
            },
            selectedRectName() {
                const rect = this.list.find(r => r.name === this.selected);
                return !rect ? '' : this.selected;
            }
        },
        methods: {
            handleRectMouseEnter(event) {
                const container = event.target.getStage().container();
                if (container.style.cursor) {
                    this.cursorStyle = container.style.cursor;
                }
                container.style.cursor = 'move';
            },
            handleRectMouseLeave(event) {
                const container = event.target.getStage().container();
                container.style.cursor = this.cursorStyle;
            },
            handleTransform(event) {
                const transformer = event.currentTarget;
                const {layerX, layerY} = event.evt;
                const range = getStageCoordsRange(transformer.getStage());

                if (layerX < range.x || layerX > range.w) {
                    transformer.stopTransform();
                }

                if (layerY < range.y || layerY > range.h) {
                    transformer.stopTransform();
                }
            },
            updateTransformer() {
                const transformerNode = this.$refs.transformer.getStage();
                const stage = transformerNode.getStage();
                const {selectedRectName} = this;
                const selectedNode = stage.findOne('.' + selectedRectName);

                if (selectedNode === transformerNode.node()) {
                    return;
                }

                if (selectedNode) {
                    transformerNode.attachTo(selectedNode);
                } else {
                    transformerNode.detach();
                }

                transformerNode.getLayer().batchDraw();
            }
        },
        watch: {
            selectedRectName() {
                this.updateTransformer();
            }
        }
    };
</script>
