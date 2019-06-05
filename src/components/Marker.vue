<template>
    <v-stage class="marker-stage" ref="stage" :config="stage"
             @mousedown="handleStageMouseDown" @mouseup="handleStageMouseUp" @mousemove="handleStageMouseMove" 
             @mouseout="handleMouseOut" @dragstart="handleDragstart" @dragend="handleDragend">

        <v-layer ref="backgroundLayer" :config="backgroundLayer">
            <background-group :src="background"></background-group>
        </v-layer>

        <v-layer ref="rectsLayer">
            <rects-group v-for="(item, index) in rectList" :key="index" :list="item" :index="index" :selected="selectedRectName"></rects-group>
        </v-layer>

        <v-layer ref="drawLayer">
            <v-rect :config="drawingRectWithStyle"></v-rect>
        </v-layer>

        <v-layer ref="textLayer">
            <v-text :config="text"></v-text>
        </v-layer>

        <v-layer ref="dragLayer"></v-layer>
    </v-stage>
</template>

<script>
    import backgroundGroup from './Background';
    import RectsGroup from './Rects';

    export default {
        components: {
            backgroundGroup,
            RectsGroup
        },
        props: {
            background: {
                type: Array,
                default() {
                    return [];
                }
            },
            drawing: {
                type: [Number, Boolean],
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
                backgroundLayer: {
                    id: 'backgroundLayer'
                },
                rectList: [
                    [
                        {
                            name: 'recta1',
                            x: 120,
                            y: 120,
                            width: 100,
                            height: 100,
                        },
                        {
                            name: 'recta2',
                            x: 550,
                            y: 180,
                            width: 300,
                            height: 158,
                        }
                    ],
                    [
                        {
                            name: 'rectb1',
                            x: 120,
                            y: 220,
                            width: 100,
                            height: 100,
                        },
                        {
                            name: 'rectb2',
                            x: 550,
                            y: 180,
                            width: 300,
                            height: 158,
                        }
                    ],
                    [
                        {
                            name: 'rectc1',
                            x: 120,
                            y: 320,
                            width: 100,
                            height: 100,
                        },
                        {
                            name: 'rectc2',
                            x: 550,
                            y: 180,
                            width: 300,
                            height: 158,
                        }
                    ]
                ],
                selectedRectName: '',
                drawingRect: {
                    name: 'rectDrawing',
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                },
                drawingRectStyle: {
                    opacity: 0.9,
                    stroke: '#c00',
                    strokeWidth: 1,
                    dash: [5, 3]
                },
                drawingRectVisible: false,
                drawingRectStart: null,
                drawingRectEnd: null,
                text: {
                    fontSize: 15,
                    text: 'Some text on canvas',
                }
            };
        },
        computed: {
            drawingRectWithStyle() {
                return Object.assign({}, this.drawingRect, this.drawingRectStyle, {
                    visible: this.drawingRectVisible,
                });
            }
        },
        methods: {
            updateStageSize() {
                this.stage.width = window.innerWidth;
                this.stage.height = window.innerHeight;
            },
            createNewRect(index) {
                const i = index - 1;
                this.rectList[i].push(Object.assign({}, this.drawingRect, {
                    name: `rect_${i}_${new Date().getTime()}`
                }));
            },
            updateDrawingRect() {
                if (!this.drawingRectStart || !this.drawingRectEnd) {
                    return;
                }

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
            resetDrawingStatus() {
                this.drawingRectStart = null;
                this.drawingRectEnd = null;
                this.drawingRect.x = 0;
                this.drawingRect.y = 0;
                this.drawingRect.width = 0;
                this.drawingRect.height = 0;
            },
            startDrawingRect(event) {
                this.drawingRectVisible = true;
                this.drawingRectStart = this.getAbsolutePosition(event);
            },
            endDrawingRect() {
                this.drawingRectVisible = false;
                this.createNewRect(this.drawing);
                this.resetDrawingStatus();
                this.$emit('drawend');
            },
            doDrawingRect(event) {
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
                    this.startDrawingRect(event);
                }
            },
            handleStageMouseMove(event) {
                if (this.drawing) {
                    this.doDrawingRect(event);
                }
                // const mousePos = this.$refs.stage.getStage().getPointerPosition();
                // const x = mousePos.x;
                // const y = mousePos.y;
                // this.text.text = 'X: ' + x + ', Y: ' + y;
            },
            handleStageMouseUp(event) {
                if (this.drawing) {
                    this.endDrawingRect(event);
                }
            },
            handleMouseOut() {
                // this.text.text = 'Mouseout';
            },
            handleDragstart() {
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
        },
        watch: {
            drawing(value) {
                const container = this.$refs.stage.getStage().container();
                container.style.cursor = value ? 'crosshair' : 'default';
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
