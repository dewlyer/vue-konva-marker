<template>
    <v-stage class="marker-stage" ref="stage" :config="stage" data-str="abc"
             @mousedown="handleMouseDown" @mouseup="handleMouseUp"
             @mousemove="handleMouseMove" @mouseout="handleMouseOut"
             @dragstart="handleDragstart" @dragend="handleDragend">

            <background-layer></background-layer>

            <rects-layer></rects-layer>

            <v-layer><v-text :config="text"></v-text></v-layer>

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
        data() {
            return {
                stage: {
                    width: 0,
                    height: 0,
                    draggable: true
                },
                text: {text: 'Some text on canvas', fontSize: 15},
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
        methods: {
            updateStageSize() {
                this.stage.width = window.innerWidth;
                this.stage.height = window.innerHeight;
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
                this.text.text = 'X: ' + x + ', Y: ' + y;
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

<style scoped lang="scss">
    .marker-stage {
        background: #999;
    }
</style>
