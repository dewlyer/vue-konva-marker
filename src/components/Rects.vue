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
                        stroke: '#45af33',
                        strokeWidth: 2,
                        opacity: 0.35,
                        draggable: true
                    },
                    {
                        fill: '#59a8da',
                        stroke: '#4988bf',
                        strokeWidth: 2,
                        opacity: 0.35,
                        draggable: true
                    },
                    {
                        fill: '#da2b29',
                        stroke: '#c22b29',
                        strokeWidth: 2,
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
                    borderDash: [4, 4],
                    rotateAnchorOffset: 40,
                    // rotateEnabled: false,
                    // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                }
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
                event.target.getStage().container().style.cursor = 'move';
            },
            rectMouseLeave(event) {
                event.target.getStage().container().style.cursor = 'default';
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
