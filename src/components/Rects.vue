<template>
    <v-group ref="rectsGroup">
        <v-rect v-for="item in rectsList"
                :key="item.name" :config="item"
                @mouseenter="rectMouseEnter"
                @mouseleave="rectMouseLeave"></v-rect>
        <v-transformer ref="transformer" :config="transformer"
                       @transform="handleTransform"></v-transformer>
    </v-group>
</template>

<script>
    import {
        RECT_MIN_PADDING,
        rectStyleBase,
        getGroupSizeByStage,
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
                rectColors: ['#63da4f', '#59a8da', '#da2b29'],
                transformer: {
                    keepRatio: false,
                    anchorSize: 6,
                    anchorFill: '#e07575',
                    anchorStroke: '#e07575',
                    borderStroke: '#be4f52',
                    borderDash: [4, 3],
                    rotateAnchorOffset: 40,
                    rotateEnabled: false,
                    // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                    boundBoxFunc(oldBoundBox, newBoundBox) {
                        const stage = this.getStage();
                        const size = getGroupSizeByStage(stage);

                        if (newBoundBox.width <= RECT_MIN_PADDING || newBoundBox.height <= RECT_MIN_PADDING) {
                            console.log(1);
                            return oldBoundBox;
                        }

                        if (newBoundBox.x < 0 || newBoundBox.x > size.width - newBoundBox.width) {
                            console.log(2);
                            return oldBoundBox;
                        }

                        if (newBoundBox.y < 0 || newBoundBox.y > size.height - newBoundBox.height) {
                            console.log(3);
                            return oldBoundBox;
                        }

                        return newBoundBox;
                    }
                },
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
                return this.list.map(item => Object.assign(item, rectStyleBase, selectStyle));
            },
            selectedRectName() {
                const rect = this.list.find(r => r.name === this.selected);
                return !rect ? '' : this.selected;
            }
        },
        methods: {
            rectMouseEnter(event) {
                const container = event.target.getStage().container();
                if (container.style.cursor) {
                    this.cursorStyle = container.style.cursor;
                }
                container.style.cursor = 'move';
            },
            rectMouseLeave(event) {
                const container = event.target.getStage().container();
                container.style.cursor = this.cursorStyle;
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
            }
        },
        watch: {
            selectedRectName() {
                this.updateTransformer();
            }
        }
    };
</script>
