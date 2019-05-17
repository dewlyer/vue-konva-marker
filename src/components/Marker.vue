<template>
  <v-stage :config="konva">

    <v-layer>
      <v-text :config="text"></v-text>
      <v-rect :config="rect"></v-rect>
    </v-layer>

  </v-stage>
</template>

<script>
  export default {
    data() {
      return {
        konva: {
          width: 1000,
          height: 500
        },
        text: {text: 'Some text on canvas', fontSize: 15},
        rect: {
          x: 20,
          y: 50,
          width: 100,
          height: 100,
          fill: 'red',
          shadowBlur: 10
        }
      };
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
