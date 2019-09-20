<template lang="pug">
    .action-wrapper
        .action-panel(:style='actionPanelStyle')
            b-card(no-body v-for='(item, index) in actionPanel.groups' :key='index' border-variant='light' bg-variant='light')
                b-card-header(header-tag='header' header-class='action-panel-header' v-b-toggle='getAccordionId(index)')
                    span.title {{ item.title }}
                    b-link(v-if='index !== 0' href='#' class='card-link' @click.stop='handleDrawStart(index)') 添加
                b-collapse(accordion='action-panel' :id='getAccordionId(index)' :visible='index === 0')
                    b-card-body
                        template(v-if='index === 0')
                            b-card-text Some quick example text to build on the
                        template(v-else-if='index === 1')
                            b-card-text Some quick example text to build on the
                        template(v-else-if='index === 2')
                            b-card-text Some quick example text to build on the
                        template(v-else)
                            b-card-text Some quick example text to build on the
        .btn-wrapper
            b-button.ml-2(squared variant='secondary' @click="handlePaperIndexChange(0)") 正面
            b-button.ml-2(squared variant='secondary' @click="handlePaperIndexChange(1)") 反面
            b-button.ml-2(squared variant='secondary' @click='handleStageScaleChange(1)') 放大
            b-button.ml-2(squared variant='secondary' @click='handleStageScaleChange(-1)') 缩小
            b-form-file.ml-2.paper-files(v-model='paperFiles' :file-name-formatter="formatPaperFilesNames"
                placeholder='更换试卷图片' browse-text='浏览' accept='image/*' no-drop multiple)
</template>

<script>
    import {mapGetters} from 'vuex'
    import {STAGE_PADDING} from '../config'

    const ACTION_GROUPS = [
        {
            title: '试卷信息'
        },
        {
            title: '客观题'
        },
        {
            title: '主观题'
        },
        {
            title: '选做题'
        },
    ];
    const STAGE_SCALE = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

    // const OUTLINE_STYLE = {
    //     'border-color': '#333',
    //     'box-shadow': '0px 3px 5px -1px rgba(0, 0, 0, 0.6);'
    // };
    // const outlineStyle = Object.entries(OUTLINE_STYLE).map(([key, value]) => key + ':' + value).join(';');

    export default {
        name: 'paper-action',
        directives: {
            // outline: {
            //     inserted(el, binding) {
            //         const target = binding.modifiers.target ? document.getElementById(binding.value) : el;
            //         target.addEventListener('mouseover', () => el.setAttribute('style', outlineStyle));
            //         target.addEventListener('mouseout', () => el.removeAttribute('style'));
            //     }
            // }
        },
        filters: {
        },
        props: {
            background: {
                type: Array,
                default() {
                    return [];
                }
            },
            showIndex: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                actionPanel: {
                    width: STAGE_PADDING,
                    groups: ACTION_GROUPS
                },
                paperFiles: null,
                stageScale: STAGE_SCALE,
                currentScale: 1
            }
        },
        computed: {
            ...mapGetters({
                drawing: 'marker/drawing',
                scale: 'marker/scale'
            }),
            actionPanelStyle() {
                return {width: this.actionPanel.width + 'px'};
            },
            currentScaleIndex() {
                return this.stageScale.indexOf(this.currentScale);
            }
        },
        created() {
            this.currentScale = this.scale;
        },
        watch: {
            paperFiles(files) {
                if (files && files.length) {
                    this.loadLocalImages(files.slice(0, 2));
                }
            }
        },
        methods: {
            formatPaperFilesNames(files) {
                if (files && files.length) {
                    return files.length > 1 ? '已选择正反两面试卷' : '已选择正面试卷';
                } else {
                    return '选择试卷无效';
                }
            },
            getAccordionId(index) {
                return 'accordion-' + index;
            },
            handlePaperImageChange(images) {
                this.$emit('update:background', images);
            },
            handlePaperIndexChange(index) {
                this.$emit('update:showIndex', index);
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
            loadLocalImages(files) {
                this.readAllImageFiles(files).then(images => {
                    if (images && images.length) {
                        this.handlePaperIndexChange(0);
                        this.handlePaperImageChange(images);
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
        background: #f8f9fa
        position: fixed
        left: 0
        top: 0
        overflow: hidden
        overflow-y: auto
        box-shadow: 1px 0 5px -1px rgba(0, 0, 0, 0.5)

    .action-panel-header
        cursor: pointer

        .title
            font-size: 16px

        .card-link
            float: right
            font-size: 14px
            color: #999
            &:hover
                color: #c00

    .btn-wrapper
        position: fixed
        right: 10px
        top: 10px

        .paper-files
            width: 240px
            overflow: hidden
            vertical-align: top
</style>
