<template lang="pug">
    .action-wrapper
        b-container.action-panel(:style='actionPanelStyle')
            b-card(v-for='(item, index) in actionPanel.groups' :key='index' :style='actionPanelCardStyle(index)' border-variant='light' bg-variant='light' no-body)
                b-card-header(header-tag='header' header-class='action-panel-header' v-b-toggle='getAccordionId(index)')
                    b-card-title.title(title-tag='span') {{ item.title }}
                    b-link.card-link(v-if='index !== 0' href='#' @click.stop='handleDrawStart(index)') 添加
                b-collapse(accordion='action-panel' :id='getAccordionId(index)' :visible='index === 0')
                    b-card-body(body-class='action-panel-body')
                        b-form(v-if='index === 0')
                            b-form-group.text-muted(v-for='group in actionPanel.infoGroup' label-cols='4' label-size='sm' :label='group.title' :key='group.title')
                                b-button.mr-2.mb-2.shadow-btn(v-for='item in group.item' size='sm' variant='light' :key='item.name'
                                    @click='handlePaperInfoDraw(item.name, item.params)') {{ getActionInfoTexts(item.name).button }}
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
            b-button-group(v-if='paperFilesStatus')
                b-button.ml-2(variant='secondary' @click='handlePaperIndexChange(0)' squared) 正面
                b-button.ml-2(variant='secondary' @click='handlePaperIndexChange(1)' squared) 反面
            b-button-group
                b-button.ml-2(variant='secondary' @click='handleStageScaleChange(1)' squared) 放大
                b-button.ml-2(variant='secondary' @click='handleStageScaleChange(-1)' squared) 缩小
                b-button.ml-2(variant='secondary' @click='handlePaperDataExport' squared) 数据
            b-form-file.ml-2.paper-files(v-model='paperFiles' :file-name-formatter='formatPaperFilesNames'
                placeholder='更换试卷图片' browse-text='浏览' accept='image/*' no-drop multiple)

        b-modal(ref='dataExportModal' title='导出数据' size='lg' ok-title='确认' ok-only centered scrollable)
            b-card.mb-3(v-for='(group, groupIndex) in exportFormatList' :key='groupIndex' :header='paperGroupHeader(groupIndex)')
                b-list-group
                    b-list-group-item(v-for='(item, index) in group' :key='index' :title='item.name')
                        span.mr-5 标签{{index}}
                        span.mr-4 X
                            b-badge.ml-2(variant='warning') {{ item.x }}
                        span.mr-4 Y
                            b-badge.ml-2(variant='warning') {{ item.y }}
                        span.mr-4 宽度
                            b-badge.ml-2(variant='info') {{ item.width }}
                        span.mr-4 高度
                            b-badge.ml-2(variant='info') {{ item.height }}
                        template(v-if='item.attrs')
                            hr
                            div.mr-4()
                                span.mr-4 题号： {{ item.attrs.no }}
                                span.mr-4 分数： {{ item.attrs.score }}
                hr
                pre {{ list }}
</template>

<script>
    import {mapGetters} from 'vuex'
    import {
        STAGE_PADDING, STAGE_SCALE,
        ACTION_GROUPS, ACTION_INFO_GROUP, ACTION_INFO_MAP,
    } from '../config'

    export default {
        name: 'paper-action',
        directives: {},
        filters: {},
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            background: {
                type: Array,
                required: true
            },
            showIndex: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                paperFiles: null,
                paperFilesStatus: null,
                stageScale: STAGE_SCALE,
                currentScale: 1,
                actionPanel: {
                    width: STAGE_PADDING,
                    groups: ACTION_GROUPS,
                    infoGroup: ACTION_INFO_GROUP,
                    infoMap: ACTION_INFO_MAP
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
            },
            exportFormatList() {
                let result = [];
                this.list.forEach(paper => {
                    paper.forEach((group, index) => {
                        if (!Array.isArray(result[index])) {
                            result[index] = [];
                        }
                        result[index] = result[index].concat(group);
                    });
                });
                return result;
            }
        },
        created() {
            this.currentScale = this.scale;
            this.updatePaperFilesStatus(this.background);
        },
        watch: {
            paperFiles(files) {
                if (files && files.length) {
                    this.loadLocalImages(files.slice(0, 2));
                    this.updatePaperFilesStatus(files);
                }
            }
        },
        methods: {
            getActionInfoTexts(key) {
                return this.actionPanel.infoMap[key];
            },
            actionPanelCardStyle(index) {
                return index > 1 ? {display: 'block'} : {};
            },
            paperGroupHeader(index) {
                return this.actionPanel.groups[index].title;
            },
            updatePaperFilesStatus(files) {
                this.paperFilesStatus = files && files.length ? files.length > 1 : null;
            },
            formatPaperFilesNames() {
                switch (this.paperFilesStatus) {
                    case false:
                        return '已选择正面试卷';
                    case true:
                        return '已选择正反两面试卷';
                    default:
                        return '选择试卷无效';
                }
            },
            getAccordionId(index) {
                return 'accordion-' + index;
            },
            handlePaperDataExport() {
                this.$refs.dataExportModal.show();
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
                this.updateDrawStatus(index, true, null, {});
            },
            handlePaperInfoDraw(id, editable) {
                this.updateDrawStatus(0, editable, id, {});
            },
            updateDrawStatus(groupIndex, editable, id, attrs) {
                const texts = this.getActionInfoTexts(id);
                const label = texts && texts.label || null;
                const draw = {
                    status: true,
                    rectId: id || null,
                    label,
                    groupIndex,
                    editable,
                    attrs
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
