<template lang="pug">
    .marker-wrapper
        v-stage.marker-stage(ref='stage' :config='stageConfig' :style='stageStyle'
            @mousedown='handleStageMouseDown' @mouseup='handleStageMouseUp'
            @mousemove='handleStageMouseMove' @mouseout='handleStageMouseOut')
            v-layer(ref='layer')
                v-group(v-for='(image, index) in background' ref='pageGroup' :key='index' :config='pageGroupConfig(index)')
                    background-group(:src='[image]')
                    rects-group(v-for='(rects, i) in rectList[index]' :key='i'
                        :pageIndex='index' :index='i' :list='rects'
                        @context='handlerRectContextMenu($event, index, i)'
                        @change='updateRectListGroup($event, index, i)')
                    draw-group(:rect='drawingRect')
        vue-simple-context-menu(ref='rectContextMenu' elementId='contextMenuA' :options='rectContextOptions'
            @option-clicked='handlerRectContextMenuClick')
</template>

<script type="text/jsx">
    import {mapGetters} from 'vuex'
    import VueSimpleContextMenu from 'vue-simple-context-menu'
    import backgroundGroup from './Background'
    import RectsGroup from './Rects'
    import DrawGroup from './Draw'
    import {STAGE_PADDING} from '../../config'

    export default {
        name: 'paper-marker',
        components: {
            VueSimpleContextMenu,
            backgroundGroup,
            RectsGroup,
            DrawGroup
        },
        props: {
            list: {
                type: Array,
                required: true
            },
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
                stagePadding: STAGE_PADDING,
                stageConfig: {
                    width: 0,
                    height: 0,
                    draggable: true
                },
                rectList: [],
                drawingRect: {
                    config: {
                        name: 'rectDrawing',
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    },
                    visible: false,
                    start: null,
                    end: null,
                },
                questionCreate: {},
                rectContextOptions: [
                    {
                        name: '编辑',
                        action: 'edit'
                    },
                    {
                        name: '删除',
                        action: 'del'
                    }
                ]
            };
        },
        computed: {
            ...mapGetters({
                draw: 'marker/draw',
                scale: 'marker/scale'
            }),
            stageStyle() {
                return {paddingLeft: this.stagePadding + 'px'};
            }
        },
        methods: {
            updateRectListGroup(rects, pageIndex, groupIndex) {
                let newList = this.easyDeepCopy(this.rectList);
                newList[pageIndex][groupIndex] = rects;
                this.rectList = newList;
            },
            pageGroupConfig(index) {
                return {visible: this.showIndex === index}
            },
            updateStageSize() {
                this.stageConfig.width = window.innerWidth - this.stagePadding;
                this.stageConfig.height = window.innerHeight;
            },
            getAbsolutePosition(event) {
                const stage = event.target.getStage();
                const {x, y} = stage.getPointerPosition();
                return {
                    x: x / this.scale,
                    y: y / this.scale
                };
            },
            updateDrawingRect() {
                if (!this.drawingRect.start || !this.drawingRect.end) {
                    return;
                }
                let stage = this.$refs.stage.getStage();
                let x = stage.x() / this.scale;
                let y = stage.y() / this.scale;
                let drawStart = this.drawingRect.start;
                let drawEnd = this.drawingRect.end;
                Object.assign(this.drawingRect.config, {
                    x: Math.min(drawStart.x, drawEnd.x) - x,
                    y: Math.min(drawStart.y, drawEnd.y) - y,
                    width: Math.abs(drawStart.x - drawEnd.x),
                    height: Math.abs(drawStart.y - drawEnd.y)
                });
            },
            handlerNewRectPromptClose() {
                this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                    if (modalId === 'questionCreateModal' && bvEvent.trigger === 'ok') {
                        if (!this.questionCreate.no || !this.questionCreate.score) {
                            bvEvent.preventDefault();
                            window.alert('请输入题号和分数');
                        }
                    }
                });
            },
            createNewRectPrompt(result) {
                const message = (
                    <b-form>
                        <b-form-group label-cols='2' label='新增题号:' label-for='questionCreateInput-1'>
                            <b-form-input id='questionCreateInput-1' placeholder='请输入题号' required='required'
                                          v-model={this.questionCreate.no}/>
                        </b-form-group>
                        <b-form-group label-cols='2' label='对应分数:' label-for='questionCreateInput-2'>
                            <b-form-input id='questionCreateInput-2' placeholder='请输入分数' required='required'
                                          v-model={this.questionCreate.score}/>
                        </b-form-group>
                    </b-form>
                );
                const option = {
                    id: 'questionCreateModal',
                    title: '新增题目',
                    size: 'md',
                    buttonSize: 'sm',
                    okTitle: '确认',
                    cancelTitle: '取消',
                    hideHeaderClose: false,
                    noCloseOnBackdrop: true,
                    centered: true,
                    scrollable: true
                };
                return new Promise((resolve, reject) => {
                    if (result.groupIndex === 0) {
                        resolve(result)
                    } else {
                        this.$bvModal.msgBoxConfirm([message], option).then(value => {
                            const {no, score} = this.questionCreate;
                            let label = no ? `题号${no}` : '';
                            score && (label += `（分数 ${score}）`);
                            result.rect.attrs = {no, score};
                            result.rect.label = label;
                            value ? resolve(result) : reject();
                        });
                    }
                });
            },
            createNewRect({status, groupIndex, rectId, editable, label, attrs}) {
                return new Promise((resolve, reject) => {
                    if (!status) {
                        reject(false);
                    } else if (this.$refs.stage.getStage().findOne('.' + rectId)) {
                        reject('标记已存在，请删除原标记再添加！');
                    } else {
                        const pageIndex = this.showIndex;
                        const rect = {
                            ...this.drawingRect.config,
                            name: rectId || `paper${pageIndex}_group${groupIndex}_x${new Date().getTime()}`,
                            editable: !!editable,
                            label,
                            attrs
                        };
                        resolve({pageIndex, groupIndex, rect});
                    }
                });
            },
            resetDrawingStatus() {
                this.drawingRect.start = null;
                this.drawingRect.end = null;
                this.drawingRect.config.x = 0;
                this.drawingRect.config.y = 0;
                this.drawingRect.config.width = 0;
                this.drawingRect.config.height = 0;
            },
            startDrawingRect(event) {
                if (!this.draw.status) {
                    return;
                }
                this.drawingRect.visible = true;
                this.drawingRect.start = this.getAbsolutePosition(event);
            },
            async endDrawingRect() {
                if (!this.draw.status) {
                    return;
                }

                try {
                    const result = await this.createNewRect(this.draw);
                    const {pageIndex, groupIndex, rect} = await this.createNewRectPrompt(result);
                    this.rectList[pageIndex][groupIndex].push(rect);
                } catch (error) {
                    if (error) {
                        this.$bvToast.toast(error, {
                            variant: 'danger',
                            toaster: 'b-toaster-bottom-right',
                            autoHideDelay: 3000,
                            appendToast: false,
                            noCloseButton: true
                        });
                    }
                } finally {
                    this.questionCreate = {};
                    this.drawingRect.visible = false;
                    this.resetDrawingStatus();
                    this.$store.commit('marker/updateDraw', {
                        draw: {
                            status: false,
                            rectId: null,
                            label: null,
                            groupIndex: null,
                            editable: false,
                            attrs: {}
                        }
                    });
                }
            },
            doDrawingRect(event) {
                if (!this.draw.status) {
                    return;
                }
                if (event.target !== event.currentTarget) {
                    this.drawingRect.end = this.getAbsolutePosition(event);
                    this.updateDrawingRect();
                }
            },
            handleStageMouseDown(event) {
                const target = event.target;
                const className = target.getClassName();

                if (className !== 'Image') {
                    return;
                }

                this.startDrawingRect(event);
            },
            handleStageMouseUp(event) {
                this.endDrawingRect(event);
            },
            handleStageMouseMove(event) {
                this.doDrawingRect(event);
            },
            handleStageMouseOut() {
            },
            handlerRectContextMenu({evt, index}, pageIndex, groupIndex) {
                this.$refs.rectContextMenu.showMenu(evt, {
                    pageIndex, groupIndex, index
                });
            },
            handlerRectContextMenuClick({item, option}) {
                const action = option.action;
                const {pageIndex, groupIndex, index} = item;
                if (action === 'del') {
                    this.deleteRectItemByIndex(pageIndex, groupIndex, index);
                } else if (action === 'edit') {
                    this.editRectItemByIndex(pageIndex, groupIndex, index);
                }
            },
            editRectItemByIndex(page, group, index) {
                let rect = this.rectList[page][group][index];
                if (!rect) {
                    return
                }

                let attrs = rect.attrs;
                if (!attrs || !Object.keys(attrs).length) {
                    return;
                }

                this.questionCreate = attrs;
                this.createNewRectPrompt({rect}, true)
                    .then(result => rect = result)
                    .then(() => this.questionCreate = {});
            },
            deleteRectItemByIndex(page, group, index) {
                this.$refs.layer.getStage().find('Transformer').detach();
                this.rectList[page][group].splice(index, 1);
            },
            easyDeepCopy(target) {
                return JSON.parse(JSON.stringify(target));
            }
        },
        watch: {
            'draw.status': {
                handler(value) {
                    const container = this.$refs.stage.getStage().container();
                    container.style.cursor = value ? 'crosshair' : 'default';
                    this.stageConfig.draggable = !value;
                }
            },
            rectList(value) {
                this.$emit('update:list', this.easyDeepCopy(value));
            },
            scale(value) {
                const stage = this.$refs.stage.getStage();
                stage.scale({x: value, y: value});
                stage.batchDraw();
                // stage.draw();
            }
        },
        created() {
            this.rectList = this.easyDeepCopy(this.list);
            this.updateStageSize();
            window.addEventListener('resize', this.updateStageSize);
        },
        mounted() {
            this.handlerNewRectPromptClose();
        }
    };
</script>

<style>@import '~vue-simple-context-menu/dist/vue-simple-context-menu.css';</style>
<style scoped lang="sass">
    .marker-stage
        background: #999
</style>
