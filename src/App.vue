<template>
    <div class="app-wrapper">
        <paper-marker :background="background" :drawing="drawing" @drawend="handleDrawEnd"/>
        <paper-action @change="handleBackgroundChange" @drawstart="handleDrawStart"/>
    </div>
</template>

<script>
    import Paper_A from './assets/paper_a.jpg'
    // import Paper_B from './assets/paper_b.jpg'
    import PaperMarker from './components/Marker'
    import PaperAction from './components/Action'

    export default {
        name: 'app',
        components: {
            PaperMarker,
            PaperAction
        },
        data() {
            return {
                background: [],
                drawing: false
            }
        },
        created() {
            const defaultBackground = [Paper_A/*, Paper_B*/];
            this.handleBackgroundChange(defaultBackground);
        },
        methods: {
            handleDrawEnd() {
                this.drawing = false;
            },
            handleDrawStart(index) {
                this.drawing = index;
            },
            handleBackgroundChange(files) {
                this.background = files;
            }
        }
    }
</script>

<style src="./assets/app.scss" lang="scss"></style>
