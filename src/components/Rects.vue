<template>
    <v-layer ref="rects">
        <v-rect v-for="item in rectsList" :key="item.id" :config="item"
                @mousedown="handleRectsMouseDown"
                @mouseenter="rectMouseOn"
                @mouseleave="rectMouseOff">
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
            styleIndex: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                selectId: '',
                style: [
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
                return this.style[this.styleIndex] || {};
            },
            rectMouseOn(event) {
                event.target.getStage().container().style.cursor = 'move';
            },
            rectMouseOff(event) {
                event.target.getStage().container().style.cursor = 'default';
            },
            handleRectsMouseDown(event) {
                if (event.target.getClassName() !== 'Rect') {
                    this.selectId = '';
                    this.updateTransformer();
                    return;
                }

                // clicked on transformer - do nothing
                if (event.target.getParent().className === 'Transformer') {
                    return;
                }

                // find clicked rect by its id
                const id = event.target.id();
                const rect = this.list.find(r => r.id === id);
                if (rect) {
                    this.selectId = id;
                } else {
                    this.selectId = '';
                }
                this.updateTransformer();
            },
            updateTransformer() {
                const transformerNode = this.$refs.transformer.getStage();
                const stage = transformerNode.getStage();
                const {selectId} = this;
                const selectedNode = stage.findOne('#' + selectId);

                // do nothing if selected node is already attached
                if (selectedNode === transformerNode.node()) {
                    return;
                }

                if (selectedNode) {
                    // attach to another node
                    transformerNode.attachTo(selectedNode);
                } else {
                    // remove transformer
                    transformerNode.detach();
                }
                transformerNode.getLayer().batchDraw();
            },
        }
    };
</script>

<style scoped lang="scss">
</style>
