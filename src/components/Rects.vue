<template>
    <v-layer ref="rects">
        <v-rect v-for="item in rectsList" :key="item.id" :config="item"
                @mousedown="rectMouseDown"
                @mouseenter="rectMouseEnter"
                @mouseleave="rectMouseLeave">
        </v-rect>
        <v-transformer ref="transformer" :config="transformer"></v-transformer>
    </v-layer>
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
            }
        },
        data() {
            return {
                selectName: '',
                rectStyles: [
                    {
                        fill: '#63da4f',
                        stroke: '#45af33',
                        strokeWidth: 2,
                        opacity: 0.35,
                        draggable: true,
                        // shadowColor: 'black',
                        // shadowBlur: 3,
                        // shadowOffset: { x: 2, y: 2 },
                        // shadowOpacity: 0.1
                    },
                    {
                        fill: '#59a8da',
                        stroke: '#4988bf',
                        strokeWidth: 2,
                        opacity: 0.35,
                        draggable: true,
                        // shadowColor: 'black',
                        // shadowBlur: 3,
                        // shadowOffset: { x: 2, y: 2 },
                        // shadowOpacity: 0.1
                    }
                ],
                transformer: {
                    keepRatio: false,
                    anchorSize: 6,
                    anchorFill: '#e07575',
                    anchorStroke: '#e07575',
                    borderStroke: '#be4f52',
                    borderDash: [4, 4],
                    rotateAnchorOffset: 40,
                    // rotateEnabled: false,
                    // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                }
            };
        },
        computed: {
            rectsList() {
                return this.list.map(item => Object.assign(item, this.getRectStyle()));
            }
        },
        created() {
        },
        methods: {
            getRectStyle() {
                return this.rectStyles[this.index] || {};
            },
            rectMouseEnter(event) {
                event.target.getStage().container().style.cursor = 'move';
            },
            rectMouseLeave(event) {
                event.target.getStage().container().style.cursor = 'default';
            },
            rectMouseDown(event) {
                if (event.target.getClassName() !== 'Rect') {
                    this.clearAllTransformer();
                    return;
                }

                if (event.target.getParent().className === 'Transformer') {
                    return;
                }

                const name = event.target.name();
                const rect = this.list.find(r => r.name === name);
                this.selectName = !rect ? '' : name;
                this.updateTransformer();
            },
            clearAllTransformer() {
                this.selectName = '';
                this.updateTransformer();
            },
            updateTransformer() {
                const transformerNode = this.$refs.transformer.getStage();
                const stage = transformerNode.getStage();
                const {selectName} = this;
                const selectedNode = stage.findOne('.' + selectName);

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
        }
    };
</script>

<style scoped lang="scss">
</style>
