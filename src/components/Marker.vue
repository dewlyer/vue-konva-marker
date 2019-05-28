<template>
    <v-stage class="marker-stage" ref="stage" :config="stage" data-str="abc"
             @mousedown="handleMouseDown" @mouseup="handleMouseUp"
             @mousemove="handleMouseMove" @mouseout="handleMouseOut"
             @dragstart="handleDragstart" @dragend="handleDragend">

            <background-layer></background-layer>

            <v-layer ref="rect">
                <v-text :config="text"></v-text>
                <v-rect v-for="item in list" :key="item.id" :config="item"
                        @mousedown="handleRectsMouseDown"
                        @mouseenter="rectMouseOn" @mouseleave="rectMouseOff">
                </v-rect>
                <v-transformer ref="transformer" :config="configTransformer"/>
            </v-layer>

            <v-layer ref="dragLayer"></v-layer>
    </v-stage>
</template>

<script>
    import BackgroundLayer from './Background';

    export default {
        components: {
            BackgroundLayer
        },
        data() {
            return {
                stage: {
                    width: 0,
                    height: 0,
                    draggable: true
                },
                list: [],
                text: {text: 'Some text on canvas', fontSize: 15},
                mouseDrawStart: null,
                mouseDrawEnd: null,
                selectedShapeId: '',
                configTransformer: {
                    keepRatio: false,
                    // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                }
            };
        },
        created() {
            this.updateStageSize();
            this.list.push({
                id: 'rect1',
                x: 100,
                y: 100,
                width: 100,
                height: 100,
                fill: '#d00',
                stroke: '#c00',
                strokeWidth: 2,
                opacity: 0.5,
                draggable: true,
                shadowColor: 'black',
                shadowBlur: 2,
                shadowOffset: { x: 1, y: 1 },
                shadowOpacity: 0.2
            })
        },
        mounted() {
            window.addEventListener('resize', this.updateStageSize);
        },
        methods: {
            updateStageSize() {
                this.stage.width = window.innerWidth;
                this.stage.height = window.innerHeight;
            },
            rectMouseOn() {
                this.$refs.stage.$el.style.cursor = 'move';
            },
            rectMouseOff() {
                this.$refs.stage.$el.style.cursor = 'default';
            },
            updateTransformer() {
                // here we need to manually attach or detach Transformer node
                const transformerNode = this.$refs.transformer.getStage();
                const stage = transformerNode.getStage();
                const { selectedShapeId } = this;

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
            handleRectsMouseDown(event) {
                const stage = event.target.getStage();

                // if (event.target.parent.$el === this.$refs.rect) {
                //     this.selectedShapeId = '';
                //     this.updateTransformer();
                //     return;
                // }
                //
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
            handleMouseDown(event) {
                const stage = event.target.getStage();
                if (event.target !== stage) {
                    return;
                }
                this.mouseDrawStart = stage.getPointerPosition();
            },
            handleMouseUp(event) {
                const stage = event.target.getStage();
                if (event.target !== stage) {
                    return;
                }
                this.mouseDrawEnd = stage.getPointerPosition();
                this.createNewRect();
            },
            getRectDrawProp() {
                let drawStart = this.mouseDrawStart;
                let drawEnd = this.mouseDrawEnd;
                return {
                    x: Math.min(drawStart.x, drawEnd.x),
                    y: Math.min(drawStart.y, drawEnd.y),
                    width: Math.abs(drawStart.x - drawEnd.x),
                    height: Math.abs(drawStart.y - drawEnd.y),
                };
            },
            createNewRect() {
                // this.list.push(Object.assign({
                //     fill: '#d00',
                //     draggable: true,
                // }, this.getRectDrawProp()));
            },
            handleMouseOut() {
                this.text.text = 'Mouseout';
            },
            handleMouseMove() {
                const mousePos = this.$refs.stage.getStage().getPointerPosition();
                const x = mousePos.x;
                const y = mousePos.y;
                this.text.text = 'x: ' + x + ', y: ' + y;
            },
            handleDragstart() {
                // console.log(event)
                // const shape = starComponent.getStage();
                // const dragLayer = vm.$refs.dragLayer.getStage();
                // const stage = vm.$refs.stage.getStage();
                //
                // // moving to another layer will improve dragging performance
                // shape.moveTo(dragLayer);
                // stage.draw();
                //
                // starComponent.config.shadowOffsetX = 15;
                // starComponent.config.shadowOffsetY = 15;
                // starComponent.config.scaleX = starComponent.config.startScale * 1.2;
                // starComponent.config.scaleY = starComponent.config.startScale * 1.2;
            },
            handleDragend() {
                // const shape = starComponent.getStage();
                // const layer = vm.$refs.layer.getStage();
                // const stage = vm.$refs.stage.getStage();
                //
                // shape.moveTo(layer);
                // stage.draw();
                //
                // shape.to({
                //   duration: 0.5,
                //   easing: Konva.Easings.ElasticEaseOut,
                //   scaleX: starComponent.config.startScale,
                //   scaleY: starComponent.config.startScale,
                //   shadowOffsetX: 5,
                //   shadowOffsetY: 5
                // });
            }
        }
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .marker-stage {
        background: #999;
    }
</style>
