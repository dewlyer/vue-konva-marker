<template>
  <v-stage ref="stage" :config="konva"
           @mousedown="handleMouseDown"
           @mouseup="handleMouseUp"
           @mousemove="handleMouseMove"
           @mouseout="handleMouseOut"
           @dragstart="handleDragstart"
           @dragend="handleDragend">
    <v-layer ref="layer">
      <v-text :config="text"></v-text>
      <v-rect v-for="item in list" :key="item.id" :config="item"></v-rect>
    </v-layer>
    <v-layer ref="dragLayer"></v-layer>
  </v-stage>
</template>

<script>
  const width = window.innerWidth;
  const height = window.innerHeight;
  let vm = {};
  export default {
    data() {
      return {
        konva: {
          width: width,
          height: height
        },
        text: {text: 'Some text on canvas', fontSize: 15},
        list: [],
        mouseDrawStart: null,
        mouseDrawEnd: null,
      };
    },
    created() {
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
      handleMouseOut(event) {
        this.text.text = 'Mouseout';
      },
      handleMouseMove(event) {
        const mousePos = this.$refs.stage.getStage().getPointerPosition();
        const x = mousePos.x;
        const y = mousePos.y;
        this.text.text = 'x: ' + x + ', y: ' + y;
      },
      handleDragstart(event) {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
