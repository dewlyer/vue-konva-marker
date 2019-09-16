<template lang="pug">
    .btn-wrapper
        input.button-draw(type='button', value='放大', @click='handleStageScaleChange(1)')
        input.button-draw(type='button', value='缩小', @click='handleStageScaleChange(-1)')
        input.button-draw(type='button', v-for='(item, index) in colors', :key='index', :value='item', @click='handleDrawStart(index)')
        input.button-draw.button-image(type='button', value='换图')
        input.input-image(type='file', multiple='', @change='loadLocalImages')
</template>

<script>
    import {mapGetters} from 'vuex'

    const COLORS = ['绿框', '蓝框', '红框'];
    const STAGE_SCALE = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

    export default {
        name: 'paper-action',
        data() {
            return {
                colors: COLORS,
                stageScale: STAGE_SCALE,
                currentScale: 1,
            }
        },
        computed: {
            ...mapGetters({
                drawing: 'marker/drawing',
                scale: 'marker/scale'
            }),
            currentScaleIndex() {
                return this.getIndexOfStageScale(this.currentScale);
            }
        },
        created() {
            this.currentScale = this.scale;
        },
        methods: {
            getIndexOfStageScale(scale) {
                return this.stageScale.indexOf(scale);
            },
            handleStageScaleChange(step) {
                let nextScaleIndex = this.currentScaleIndex + step;
                if (nextScaleIndex >= 0 && nextScaleIndex < this.stageScale.length) {
                    this.currentScale = this.stageScale[nextScaleIndex];
                    this.$store.commit('marker/updateScale', {scale: this.currentScale});
                }
            },
            handleDrawStart(index) {
                this.$store.commit('marker/toggleDrawing', {drawing: index + 1});
            },
            loadLocalImages(e) {
                this.readAllImageFiles(e.target.files).then(files => {
                    if (files && files.length) {
                        this.$emit('change', files);
                    }
                });
            },
            readAllImageFiles(files) {
                return Promise.all(Array.prototype.map.call(files, file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target['result']);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })));
            }
        }
    }
</script>
