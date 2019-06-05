<template>
    <v-group ref="rectsGroup">
        <v-rect v-for="item in rectsList" :key="item.name" :config="item"
                @mouseenter="rectMouseEnter" @mouseleave="rectMouseLeave"></v-rect>
        <v-transformer ref="transformer" :config="transformer"></v-transformer>
    </v-group>
</template>

<script>
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
                rectStyles: [
                    {
                        fill: '#63da4f',
                        opacity: 0.35,
                        draggable: true,
                        dragBoundFunc: pos => {
                            const stage = this.$refs.rectsGroup.getStage().getStage();
                            console.log(stage.findOne('#backgroundGroup').x());
                            console.log(stage.findOne('#backgroundGroup').height());
                            let x = stage.width() / 2;
                            let y = 70;
                            let radius = 50;
                            let scale =
                                radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                            if (scale < 1)
                                return {
                                    y: Math.round((pos.y - y) * scale + y),
                                    x: Math.round((pos.x - x) * scale + x)
                                };
                            else return pos;
                        }
                    },
                    {
                        fill: '#59a8da',
                        opacity: 0.35,
                        draggable: true
                    },
                    {
                        fill: '#da2b29',
                        opacity: 0.35,
                        draggable: true
                    }
                ],
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
                const rectStyle = this.rectStyles[this.index] || {};
                return this.list.map(item => Object.assign(item, rectStyle));
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
        created() {}
    };
</script>

<style scoped lang="scss">
</style>
