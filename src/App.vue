<template>
    <div class="app-wrapper">
        <paper-marker :list="list"
                      :scale="scale"
                      :drawing="drawing"
                      :background="background"
                      @change="handleDataChange"
                      @drawend="handleDrawEnd"/>
        <paper-action :scale="scale"
                      @drawstart="handleDrawStart"
                      @scale="handleStageScale"
                      @change="handleBackgroundChange"/>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Paper_A from './assets/paper_a.jpg'
    import Paper_B from './assets/paper_b.jpg'
    import PaperMarker from './components/Marker'
    import PaperAction from './components/Action'

    const RECT_LIST = [
        [
            {
                name: 'recta1',
                x: 120,
                y: 120,
                width: 100,
                height: 100,
            },
            {
                name: 'recta2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ],
        [
            {
                name: 'rectb1',
                x: 120,
                y: 220,
                width: 100,
                height: 100,
            },
            {
                name: 'rectb2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ],
        [
            {
                name: 'rectc1',
                x: 120,
                y: 320,
                width: 100,
                height: 100,
            },
            {
                name: 'rectc2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ]
    ];

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
            const defaultBackground = [Paper_A, Paper_B];
            this.list = RECT_LIST;
            this.handleBackgroundChange(defaultBackground);
        },
        computed: mapGetters({
            drawing: 'marker/drawing',
            scale: 'marker/scale'
        }),
        methods: {
            handleDrawEnd() {
                this.drawing = false;
            },
            handleDrawStart(index) {
                this.drawing = index;
            },
            handleStageScale(value) {
                this.scale = value;
            },
            handleBackgroundChange(files) {
                this.background = files;
            },
            handleDataChange(list) {
                this.list = list;
            }
        }
    }
</script>

<style src="./assets/app.scss" lang="scss"></style>
