<template>
  <div id="app">
    <PaperMarker/>
  </div>
</template>

<script>

import PaperMarker from './components/Marker'

export default {
  name: 'app',
  components: {
    PaperMarker
  }
}
</script>

<style lang="scss">
  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
