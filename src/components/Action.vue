<template lang="pug">
    .action-wrapper
        b-container.action-panel(:style='actionPanelStyle')
            b-card(no-body v-for='(item, index) in actionPanel.groups' :key='index' border-variant='light' bg-variant='light')
                b-card-header(header-tag='header' header-class='action-panel-header' v-b-toggle='getAccordionId(index)')
                    b-card-title.title(title-tag='span') {{ item.title }}
                    b-link.card-link(v-if='index !== 0' href='#' @click.stop='handleDrawStart(index)') 添加
                b-collapse(accordion='action-panel' :id='getAccordionId(index)' :visible='index === 0')
                    b-card-body(body-class='action-panel-body')
                        b-form(v-if='index === 0')
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='水平矫正：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light' @click='handlePaperInfoDraw("1111")') 定位点
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 水平点
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='科目识别：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='考号区：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 条形码区
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 填涂考号
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='定位点：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 定位点1
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 定位点2
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 定位点3
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='缺考：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                            b-form-group.text-muted.mb-0(label-cols='4' label-size='sm' label='遮罩区：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                        b-form(v-else-if='index === 1')
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='缺考：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                            b-form-group.text-muted.mb-0(label-cols='4' label-size='sm' label='遮罩区：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                        b-form(v-else-if='index === 2')
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='缺考：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                            b-form-group.text-muted.mb-0(label-cols='4' label-size='sm' label='遮罩区：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                        b-form(v-else)
                            b-form-group.text-muted(label-cols='4' label-size='sm' label='缺考：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
                            b-form-group.text-muted.mb-0(label-cols='4' label-size='sm' label='遮罩区：')
                                b-button.mr-2.mb-2.shadow-btn(size='sm' variant='light') 选择
        b-button-toolbar.btn-wrapper
            b-button.ml-2(squared variant='secondary' @click="handlePaperIndexChange(0)") 正面
            b-button.ml-2(squared variant='secondary' @click="handlePaperIndexChange(1)") 反面
            b-button.ml-2(squared variant='secondary' @click='handleStageScaleChange(1)') 放大
            b-button.ml-2(squared variant='secondary' @click='handleStageScaleChange(-1)') 缩小
            b-form-file.ml-2.paper-files(v-model='paperFiles' :file-name-formatter="formatPaperFilesNames"
                placeholder='更换试卷图片' browse-text='浏览' accept='image/*' no-drop multiple)
</template>

<script>
    import {mapGetters} from 'vuex'
    import {STAGE_PADDING, STAGE_SCALE} from '../config'

    const ACTION_GROUPS = [
        {title: '试卷信息'},
        {title: '客观题'},
        {title: '主观题'},
        {title: '选做题'},
    ];

    export default {
        name: 'paper-action',
        directives: {},
        filters: {},
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
                paperFiles: null,
                stageScale: STAGE_SCALE,
                currentScale: 1,
                actionPanel: {
                    width: STAGE_PADDING,
                    groups: ACTION_GROUPS
                }
            }
        },
        computed: {
            ...mapGetters({
                draw: 'marker/draw',
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
                this.updateDrawStatus(index);
            },
            handlePaperInfoDraw(id) {
                this.updateDrawStatus(0, id);
            },
            updateDrawStatus(index, id) {
                const draw = {
                    status: true,
                    groupIndex: index,
                    rectId: id || null
                };
                this.$store.commit('marker/updateDraw', {draw});
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
    .shadow-btn
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.35)

    .action-panel
        position: fixed
        left: 0
        top: 0
        overflow: hidden
        overflow-y: auto
        height: 100%
        padding: 0
        background: #f8f9fa
        box-shadow: 1px 1px 10px -1px rgba(0, 0, 0, 0.35)

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

    .action-panel-body
        padding: 15px

    .btn-wrapper
        position: fixed
        right: 10px
        top: 10px

        .paper-files
            width: 240px
            overflow: hidden
            vertical-align: top
</style>
