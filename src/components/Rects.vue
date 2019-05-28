<template>
    <v-layer ref="rect">
        <v-rect v-for="item in list" :key="item.id" :config="item"
                @mousedown="handleRectsMouseDown"
                @mouseenter="rectMouseOn"
                @mouseleave="rectMouseOff">
        </v-rect>
        <v-transformer ref="transformer" :config="transformer"/>
    </v-layer>
</template>

<script>
    export default {
        data() {
            return {
                selectedShapeId: '',
                list: [],
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
        created() {
            this.list.push({
                id: 'rect1',
                x: 100,
                y: 100,
                width: 100,
                height: 100,
                fill: '#63da4f',
                stroke: '#45af33',
                strokeWidth: 2,
                opacity: 0.35,
                draggable: true,
                // shadowColor: 'black',
                // shadowBlur: 3,
                // shadowOffset: { x: 2, y: 2 },
                // shadowOpacity: 0.1
            })
        },
        methods: {
            rectMouseOn(event) {
                event.target.getStage().container().style.cursor = 'move';
            },
            rectMouseOff(event) {
                event.target.getStage().container().style.cursor = 'default';
            },
            handleRectsMouseDown(event) {
                if (event.target.getClassName() !== 'Rect') {
                    this.selectedShapeId = '';
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
                    this.selectedShapeId = id;
                } else {
                    this.selectedShapeId = '';
                }
                this.updateTransformer();
            },
            updateTransformer() {
                const transformerNode = this.$refs.transformer.getStage();
                const stage = transformerNode.getStage();
                const {selectedShapeId} = this;
                const selectedNode = stage.findOne('#' + selectedShapeId);

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
