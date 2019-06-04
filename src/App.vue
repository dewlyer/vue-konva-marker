<template>
    <div id="app">
        <paper-marker :background="background" :drawing="drawing" @drawend="handleDrawEnd"></paper-marker>
        <div class="btn-wrapper">
            <button type="button" class="button-draw" @click="handleDrawStart(1)">绿框</button>
            <button type="button" class="button-draw" @click="handleDrawStart(2)">蓝框</button>
            <button type="button" class="button-draw" @click="handleDrawStart(3)">红框</button>
            <button type="button" class="button-image">换图</button>
            <input type="file" class="input-image" @change="loadLocalImages" multiple>
        </div>
    </div>
</template>

<script>
    import Paper_A from './assets/paper_a.jpg';
    import Paper_B from './assets/paper_b.jpg';
    import PaperMarker from './components/Marker'

    export default {
        name: 'app',
        components: {
            PaperMarker
        },
        data() {
            return {
                background: [Paper_A, Paper_B],
                drawing: false
            }
        },
        computed: {
        },
        methods: {
            handleDrawStart(index) {
                this.drawing = index;
            },
            handleDrawEnd() {
                this.drawing = false;
            },
            loadLocalImages(e) {
                this.readAllImageFiles(e.target.files).then(files => {
                    if (files && files.length) {
                        this.background = files;
                    }
                });
            },
            readAllImageFiles(files) {
                return Promise.all(Array.prototype.map.call(files, file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })));
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

    .btn-wrapper {
        position: fixed;
        left: 10px;
        top: 10px;
        button {
            margin: 3px;
            padding: 5px 10px;
            background: #666;
            border: 1px solid #666;
            color: #fff;
            opacity: 0.9;
            outline: none;
        }
        .button-image {}
        .input-image {
            width: 46px;
            margin-left: -53px;
            padding: 5px;
            opacity: 0;
            background: #c00;
        }
    }
</style>
