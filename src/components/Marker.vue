<template>
    <v-stage class="marker-stage" ref="stage" :config="stage"
             @mousedown="handleMouseDown" @mouseup="handleMouseUp"
             @mousemove="handleMouseMove" @mouseout="handleMouseOut"
             @dragstart="handleDragstart" @dragend="handleDragend">

        <background-layer></background-layer>

        <rects-layer :list="rectList" :index="styleIndex"></rects-layer>

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
                        id: 'rect1',
                        x: 120,
                        y: 120,
                        width: 100,
                        height: 100,
                    },
                    {
                        id: 'rect2',
                        x: 550,
                        y: 180,
                        width: 300,
                        height: 158,
                    }
                ],
                text: {
                    fontSize: 15,
                    text: 'Some text on canvas',
                },
                mouseDrawStart: null,
                mouseDrawEnd: null,
            };
        },
        created() {
            this.updateStageSize();
        },
        mounted() {
            window.addEventListener('resize', this.updateStageSize);
        },
        watch: {
            drawing(value) {
                this.stage.draggable = !value;
            }
        },
        methods: {
            updateStageSize() {
                this.stage.width = window.innerWidth;
                this.stage.height = window.innerHeight;
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
            createNewRect() {
                this.rectList.push(Object.assign({
                    id: 'rect_' + new Date().getTime()
                }, this.getRectDrawProp()));
            },
            handleMouseOut() {
                this.text.text = 'Mouseout';
            },
            handleMouseMove() {
                const mousePos = this.$refs.stage.getStage().getPointerPosition();
                const x = mousePos.x;
                const y = mousePos.y;
                this.text.text = 'X: ' + x + ', Y: ' + y;
            },
            handleMouseDown(event) {
                if (event.target.getClassName() !== 'Image') {
                    return;
                }

                const stage = event.target.getStage();

                if (this.drawing) {
                    this.mouseDrawStart = stage.getPointerPosition();
                } else {
                    console.log(this.drawing);
                }
            },
            handleMouseUp(event) {
                if (event.target.getClassName() !== 'Image') {
                    return;
                }

                const stage = event.target.getStage();

                if (this.drawing) {
                    this.mouseDrawEnd = stage.getPointerPosition();
                    this.createNewRect();
                } else {
                    console.log(this.drawing);
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
        }
    };

</script>

<style scoped lang="scss">
    .marker-stage {
        background: #999;
    }
</style>
