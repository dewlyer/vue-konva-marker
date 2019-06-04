<template>
    <v-stage class="marker-stage" ref="stage" :config="stage"
             @mousedown="handleStageMouseDown" @mouseup="handleStageMouseUp" @mousemove="handleStageMouseMove" 
             @mouseout="handleMouseOut" @dragstart="handleDragstart" @dragend="handleDragend">

        <background-layer :src="background"></background-layer>

        <rects-layer :list="rectList" :index="styleIndex" :selected="selectedRectName"></rects-layer>

        <v-layer ref="drawLayer">
            <v-rect :config="drawingRect"></v-rect>
        </v-layer>

        <v-layer ref="textLayer">
            <v-text :config="text"></v-text>
        </v-layer>

        <v-layer ref="dragLayer"></v-layer>
    </v-stage>
</template>

<script>
    import BackgroundLayer from './Background';
    import RectsLayer from './Rects';

    export default {
        components: {
            BackgroundLayer,
            RectsLayer
        },
        props: {
            background: {
                type: Array,
                default() {
                    return [];
                }
            },
            drawing: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                stage: {
                    width: 0,
                    height: 0,
                    draggable: true
                },
                styleIndex: 0,
                rectList: [
                    {
                        name: 'rect1',
                        x: 120,
                        y: 120,
                        width: 100,
                        height: 100,
                    },
                    {
                        name: 'rect2',
                        x: 550,
                        y: 180,
                        width: 300,
                        height: 158,
                    }
                ],
                selectedRectName: '',
                drawingRect: {
                    name: 'rectDrawing',
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    stroke: '#c00',
                    strokeWidth: 1,
                    visible: false
                },
                drawingRectStart: {
                    x: 0,
                    y: 0
                },
                drawingRectEnd: {
                    x: 0,
                    y: 0
                },
                text: {
                    fontSize: 15,
                    text: 'Some text on canvas',
                }
            };
        },
        computed: {
        },
        methods: {
            updateStageSize() {
                this.stage.width = window.innerWidth;
                this.stage.height = window.innerHeight;
            },
            createNewRect() {
                this.rectList.push(Object.assign({
                    name: 'rect_' + new Date().getTime()
                }, this.drawingRect));
            },
            updateDrawingRect() {
                let stage = this.$refs.stage.getStage();
                let x = stage.x();
                let y = stage.y();
                let drawStart = this.drawingRectStart;
                let drawEnd = this.drawingRectEnd;
                Object.assign(this.drawingRect, {
                    x: Math.min(drawStart.x, drawEnd.x) - x,
                    y: Math.min(drawStart.y, drawEnd.y) - y,
                    width: Math.abs(drawStart.x - drawEnd.x),
                    height: Math.abs(drawStart.y - drawEnd.y),
                });
            },
            getAbsolutePosition(event) {
                const stage = event.target.getStage();
                const pointer = stage.getPointerPosition();
                // const {x, y} = stage.getAbsolutePosition();
                // console.log(x, y)
                // return {
                //     x: pointer.x,
                //     y: pointer.y
                // };
                return pointer;
            },
            startDrawingRect() {
                this.drawingRect.visible = true;
                this.drawingRectStart = this.getAbsolutePosition(event);
            },
            endDrawingRect() {
                this.drawingRect.visible = false;
                this.createNewRect();
                this.$emit('drawend');
            },
            doDrawingRect() {
                this.drawingRectEnd = this.getAbsolutePosition(event);
                this.updateDrawingRect();
            },
            handleStageMouseDown(event) {
                const target = event.target;
                const className = target.getClassName();

                if (target.getParent().getClassName() !== 'Transformer') {
                    this.selectedRectName = className === 'Rect' ? target.name() : '';
                }

                if (className !== 'Image') {
                    return;
                }

                if (this.drawing) {
                    this.startDrawingRect();
                }
            },
            handleStageMouseMove(event) {
                if (this.drawing) {
                    this.doDrawingRect();
                }
                // const mousePos = this.$refs.stage.getStage().getPointerPosition();
                // const x = mousePos.x;
                // const y = mousePos.y;
                // this.text.text = 'X: ' + x + ', Y: ' + y;
            },
            handleStageMouseUp(event) {
                if (this.drawing) {
                    this.endDrawingRect();
                }
            },
            handleMouseOut() {
                // this.text.text = 'Mouseout';
            },
            handleDragstart(event) {
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
            handleDragend(event) {
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
        },
        watch: {
            drawing(value) {
                this.stage.draggable = !value;
            }
        },
        created() {
            this.updateStageSize();
        },
        mounted() {
            window.addEventListener('resize', this.updateStageSize);
        }
    };
</script>

<style scoped lang="scss">
    .marker-stage {
        background: #999;
    }
</style>
