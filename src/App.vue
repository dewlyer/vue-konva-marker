<template>
    <div class="app-wrapper">
        <paper-marker :list="list" :background="background" @change="updateDataList"/>
        <paper-action @change="updateBackground"/>
    </div>
</template>

<script>
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
            this.updateBackground([Paper_A, Paper_B]);
            this.updateDataList(RECT_LIST);
        },
        methods: {
            updateBackground(files) {
                this.background = files;
            },
            updateDataList(list) {
                this.list = list;
            }
        }
    }
</script>

<style src="./assets/app.scss" lang="scss"></style>
