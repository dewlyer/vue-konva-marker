<template>
    <v-group ref="rectsGroup">
        <v-rect v-for="item in rectsList" :key="item.name" :config="item"
                @mouseenter="rectMouseEnter" @mouseleave="rectMouseLeave"></v-rect>
        <v-transformer ref="transformer" :config="transformer"></v-transformer>
    </v-group>
</template>

<script>
    let rectStyleBase = {
        fill: '#999',
        opacity: 0.35,
        draggable: true,
        dragBoundFunc(pos) {
            const stage = this.getStage();
            const group = stage.findOne('.backgroundGroup');
            const offset = stage.getAbsolutePosition();
            const x = offset.x;
            const y = offset.y;
            const w = offset.x + group.width() - this.width();
            const h = offset.y + group.height() - this.height();

            if (pos.x > w) {
                pos.x = w;
            } else if (pos.x < x) {
                pos.x = x;
            }

            if (pos.y > h) {
                pos.y = h;
            } else if (pos.y < y) {
                pos.y = y;
            }

            return pos;
        }
    };

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
                    // rotateEnabled: false,
                    // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
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
