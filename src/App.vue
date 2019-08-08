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
        computed: {},
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

<style src="./assets/app.scss"></style>
