<template>
    <div id="app">
        <paper-marker :drawing="drawing" @drawend="handleDrawEnd"></paper-marker>
        <button type="button" class="button-draw" @click="handleDrawStart">{{drawBtnText}}</button>
    </div>
</template>

<script>
    import PaperMarker from './components/Marker'

    export default {
        name: 'app',
        components: {
            PaperMarker
        },
        data() {
            return {
                drawing: false
            }
        },
        computed: {
            drawBtnText() {
                return this.drawing ? '拖动' : '画框';
            }
        },
        methods: {
            handleDrawStart() {
                this.drawing = true;
            },
            handleDrawEnd() {
                this.drawing = false;
            }
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

    .button-draw {
        position: fixed;
        left: 10px;
        top: 10px;
    }
</style>
