<template>
    <v-stage class="marker-stage" ref="stage" :config="stage"
             @mousedown="handleMouseDown" @mouseup="handleMouseUp"
             @mousemove="handleMouseMove" @mouseout="handleMouseOut"
             @dragstart="handleDragstart" @dragend="handleDragend">

        <background-layer :src="background"></background-layer>

        <rects-layer :list="rectList" :index="styleIndex"></rects-layer>

        <v-layer ref="drawLayer">
            <v-rect :config="drawingRect"></v-rect>
        </v-layer>

        <v-layer>
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
                text: {
                    fontSize: 15,
                    text: 'Some text on canvas',
                },
                mouseDrawStart: null,
                mouseDrawEnd: null,
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
                }, this.getRectDrawProp()));
            },
            getRectDrawProp() {
                let stage = this.$refs.stage.getStage();
                let x = stage.x();
                let y = stage.y();
                let drawStart = this.mouseDrawStart;
                let drawEnd = this.mouseDrawEnd;
                return {
                    x: Math.min(drawStart.x, drawEnd.x) - x,
                    y: Math.min(drawStart.y, drawEnd.y) - y,
                    width: Math.abs(drawStart.x - drawEnd.x),
                    height: Math.abs(drawStart.y - drawEnd.y),
                };
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
            handleMouseOut() {
                // this.text.text = 'Mouseout';
            },
            handleMouseDown(event) {
                if (event.target.getClassName() !== 'Image') {
                    return;
                }

                if (this.drawing) {
                    this.mouseDrawStart = this.getAbsolutePosition(event);
                    this.drawingRect.x = this.mouseDrawStart.x;
                    this.drawingRect.y = this.mouseDrawStart.y;
                    this.drawingRect.visible = true;
                } else {
                    // console.log(this.drawing);
                }
            },
            handleMouseMove() {
                // const mousePos = this.$refs.stage.getStage().getPointerPosition();
                // const x = mousePos.x;
                // const y = mousePos.y;
                // this.text.text = 'X: ' + x + ', Y: ' + y;

                // if (this.drawing) {
                //     if (this.drawingRect.visible) {
                //         this.mouseDrawEnd = this.getAbsolutePosition(event);
                //         this.createNewRect();
                //     }
                // } else {
                //     // console.log(this.drawing);
                // }
            },
            handleMouseUp(event) {
                if (event.target.getClassName() !== 'Image') {
                    return;
                }

                if (this.drawing) {
                    this.mouseDrawEnd = this.getAbsolutePosition(event);
                    this.createNewRect();
                    this.$emit('drawend');
                } else {
                    // console.log(this.drawing);
                }
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
