<template>
    <v-stage ref="stage" :config="stage"
             @mousedown="handleMouseDown" @mouseup="handleMouseUp"
             @mousemove="handleMouseMove" @mouseout="handleMouseOut"
             @dragstart="handleDragstart" @dragend="handleDragend">

        <v-layer ref="backgroundLayer">
            <v-image :config="background"></v-image>
        </v-layer>

        <v-layer ref="layer">
            <v-text :config="text"></v-text>
            <v-rect v-for="item in list" :key="item.id" :config="item"></v-rect>
        </v-layer>

        <v-layer ref="dragLayer"></v-layer>

    </v-stage>
</template>

<script>
    import Logo from '../assets/logo.png';

    const width = window.innerWidth;
    const height = window.innerHeight;

    export default {
        data() {
            return {
                stage: {
                    width: width,
                    height: height
                },
                background: {
                    image: null
                },
                list: [],
                text: {text: 'Some text on canvas', fontSize: 15},
                mouseDrawStart: null,
                mouseDrawEnd: null,
            };
        },
        created() {
            const backgroundImage = new window.Image();
            backgroundImage.src = Logo;
            backgroundImage.onload = () => {
                this.background.image = backgroundImage;
            };

            this.list.push({
                x: 100,
                y: 100,
                width: 100,
                height: 100,
                fill: '#d00',
                draggable: true,
            })
        },
        methods: {
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
                this.list.push(Object.assign({
                    fill: '#d00',
                    draggable: true,
                }, this.getRectDrawProp()));
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
</style>
