<template lang="pug">
    .app-wrapper
        paper-marker(:list='list', :background='background', @change='updateDataList')
        paper-action(@change='updateBackground')
</template>

<script>
    import PaperMarker from './components/Marker'
    import PaperAction from './components/Action'
    import Paper_A from './assets/paper/a.jpg'
    import Paper_B from './assets/paper/b.jpg'

    const RECT_LIST = [
        [
            {
                name: 'rect_a_1',
                x: 120,
                y: 120,
                width: 100,
                height: 100,
            },
            {
                name: 'rect_a_2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ],
        [
            {
                name: 'rect_b_1',
                x: 120,
                y: 220,
                width: 100,
                height: 100,
            },
            {
                name: 'rect_b_2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ],
        [
            {
                name: 'rect_c_1',
                x: 120,
                y: 320,
                width: 100,
                height: 100,
            },
            {
                name: 'rect_c_2',
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
