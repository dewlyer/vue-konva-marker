<template lang="pug">
    .app-wrapper
        paper-marker(:list.sync='list' :background='background')
        paper-action(@change='updateBackground')
</template>

<script>
    import PaperMarker from './components/Marker'
    import PaperAction from './components/Action'
    import Paper_A from './assets/paper/a.jpg'
    import Paper_B from './assets/paper/b.jpg'
    import Rect_List from './Data'

    export default {
        name: 'app',
        components: {
            PaperMarker,
            PaperAction
        },
        data() {
            return {
                list: [],
                background: []
            }
        },
        created() {
            this.list = Rect_List;
            this.updateBackground([Paper_A, Paper_B]);
        },
        methods: {
            updateBackground(files) {
                this.background = files;
            }
        }
    }
</script>

<style lang="scss">
    @import '~bootstrap/scss/bootstrap';
    @import '~bootstrap-vue/src/index';
    @import './assets/app';
</style>
