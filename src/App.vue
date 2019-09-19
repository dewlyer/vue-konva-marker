<template lang="pug">
    .app-wrapper
        paper-marker(:background='background' :showIndex="showIndex" :list.sync='list')
        paper-action(:background.sync='background' :showIndex.sync="showIndex")
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
                background: [],
                showIndex: 0
            }
        },
        created() {
            this.list = Rect_List;
            this.background = [Paper_A, Paper_B];
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    @import '~bootstrap/scss/bootstrap';
    @import '~bootstrap-vue/src/index';
    @import './assets/app';
</style>
