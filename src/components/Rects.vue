<template>
    <v-layer ref="rectsLayer">
        <v-group v-for="(rects, index) in rectsList" :key="index">
            <v-rect v-for="item in rects" :key="item.name" :config="item"
                    @mouseenter="handleRectMouseEnter"
                    @mouseleave="handleRectMouseLeave"
                    @click="handleRectClick">
            </v-rect>
        </v-group>
        <v-transformer ref="transformer" :config="transformer" @transform="handleTransform"></v-transformer>
    </v-layer>
</template>

<script>
    import {
        rectColors, rectConfig, transformerConfig,
        getStageCoordsRange
    } from './Rects.module'

    export default {
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
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
                return this.list.map((rects, index) => this.getListEx(rects, index));
            },
            selectedRect() {
                let isInList = false;
                this.list.forEach(rects => {
                    if (rects.find(r => r.name === this.selected)) {
                        isInList = true;
                    }
                });
                return isInList ? this.selected : '';
            }
        },
        methods: {
            getListEx(rects, index) {
                if (!rects) {
                    return [];
                }

                const selectColor = this.rectColors[index];
                const selectStyle = {};
                if (selectColor) {
                    selectStyle.fill = selectColor;
                }
                return rects.map(item => Object.assign(item, rectConfig, selectStyle));
            },
            handleRectClick(event) {
                const targetRect = event.currentTarget;
                const rectGroup = targetRect.getParent();
                const rectLayer = targetRect.getLayer();
                targetRect.moveToTop();
                rectGroup.moveToTop();
                rectLayer.batchDraw();
            },
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
                const selectedNode = stage.findOne('.' + this.selectedRect);

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
            selectedRect() {
                this.updateTransformer();
            }
        }
    };
</script>
