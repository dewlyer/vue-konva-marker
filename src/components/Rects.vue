<template>
    <v-group ref="rectsGroup">
        <v-rect v-for="item in rectsList" :key="item.name" :config="item"
                @mouseenter="rectMouseEnter" @mouseleave="rectMouseLeave"></v-rect>
        <v-transformer ref="transformer" :config="transformer"
                       @transform="handleTransform"></v-transformer>
    </v-group>
</template>

<script>
    const RECT_MIN_PADDING = 20;
    let rectStyleBase = {
        fill: '#999',
        opacity: 0.35,
        draggable: true,
        dragBoundFunc(pos) {
            const stage = this.getStage();
            const range = getStageCoordsRange(stage);
            const w = this.width() * this.scaleX();
            const h = this.height() * this.scaleY();

            if (pos.x > range.w - w) {
                pos.x = range.w - w;
            } else if (pos.x < range.x) {
                pos.x = range.x;
            }

            if (pos.y > range.h - h) {
                pos.y = range.h - h;
            } else if (pos.y < range.y) {
                pos.y = range.y;
            }

            return pos;
        }
    };

    function getStageCoordsRange(stage) {
        const group = stage.findOne('.backgroundGroup');
        const offset = stage.getAbsolutePosition();
        const x = offset.x;
        const y = offset.y;
        const w = offset.x + group.width();
        const h = offset.y + group.height();
        return {x, y, w, h};
    }

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
                        const range = getStageCoordsRange(stage);

                        if (newBoundBox.width <= RECT_MIN_PADDING || newBoundBox.height <= RECT_MIN_PADDING) {
                            console.log(1);
                            return oldBoundBox;
                        }

                        if (newBoundBox.x < range.x || newBoundBox.x > range.w - newBoundBox.width) {
                            return oldBoundBox;
                        }

                        if (newBoundBox.y < range.y || newBoundBox.y > range.h - newBoundBox.height) {
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
        },
        created() {
        }
    };
</script>

<style scoped lang="scss">
</style>
