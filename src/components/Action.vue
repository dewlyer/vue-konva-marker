<template lang="pug">
    .action-wrapper

        .action-panel(:style='{width: actionPanelWidth + "px"}')
            b-card(no-body v-for='index of 4' :key='index')
                b-card-header(header-tag='header' v-b-toggle='"accordion-" + index') {{actionPanelTitle[index - 1]}}
                b-collapse(accordion='my-accordion' :id='"accordion-" + index' :visible='index === 1')
                    b-card-body
                        template(v-if='index === 1')
                            b-card-text Some quick example text to build on the
                        template(v-else-if='index === 2')
                            b-card-text Some quick example text to build on the
                        template(v-else-if='index === 3')
                            b-card-text Some quick example text to build on the
                        template(v-else)
                            b-card-text Some quick example text to build on the

        .btn-wrapper
            input.button-draw(type='button', value='放大', v-outline, @click='handleStageScaleChange(1)')
            input.button-draw(type='button', value='缩小', v-outline, @click='handleStageScaleChange(-1)')
            input.button-draw(type='button', v-for='(item, index) in colors', :key='index', :value='item|buttonText', v-outline,
                @click='handleDrawStart(index)')
            template
                input.button-draw.button-image(type='button', value='换图', v-outline.target="'changeImageBtn'")
                input.input-image#changeImageBtn(type='file', multiple='multiple', @change='loadLocalImages')
</template>

<script>
    import {mapGetters} from 'vuex'
    import {STAGE_PADDING} from '../config'

    const COLORS = ['绿', '蓝', '红'];
    const STAGE_SCALE = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
    const OUTLINE_STYLE = {
        'border-color': '#333',
        'box-shadow': '0px 3px 5px -1px rgba(0, 0, 0, 0.6);'
    };
    const outlineStyle = Object.entries(OUTLINE_STYLE).map(([key, value]) => key + ':' + value).join(';');
    const ACTION_GROUP_TITLE = ['标题一','标题二','标题三','标题四'];

    export default {
        name: 'paper-action',
        directives: {
            outline: {
                inserted(el, binding) {
                    const target = binding.modifiers.target ? document.getElementById(binding.value) : el;
                    target.addEventListener('mouseover', () => el.setAttribute('style', outlineStyle));
                    target.addEventListener('mouseout', () => el.removeAttribute('style'));
                }
            }
        },
        filters: {
            buttonText(value) {
                return `${value}框`;
            }
        },
        data() {
            return {
                colors: COLORS,
                stageScale: STAGE_SCALE,
                currentScale: 1,
                actionPanelWidth: STAGE_PADDING,
                actionPanelTitle: ACTION_GROUP_TITLE
            }
        },
        computed: {
            ...mapGetters({
                drawing: 'marker/drawing',
                scale: 'marker/scale'
            }),
            currentScaleIndex() {
                return this.stageScale.indexOf(this.currentScale);
            }
        },
        created() {
            this.currentScale = this.scale;
        },
        methods: {
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

<style lang="sass" scoped>
    .action-panel
        height: 100%
        background: #eee
        position: fixed
        left: 0
        top: 0
        overflow: hidden
        overflow-y: auto
        box-shadow: 1px 0 5px -1px rgba(0, 0, 0, 0.5)
</style>
