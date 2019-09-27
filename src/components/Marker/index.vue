<template lang="pug">
    .marker-wrapper
        v-stage.marker-stage(ref='stage' :config='stageConfig' :style='stageStyle'
            @mousedown='handleStageMouseDown' @mouseup='handleStageMouseUp'
            @mousemove='handleStageMouseMove' @mouseout='handleStageMouseOut')
            v-layer
                v-group(v-for='(image, index) in background' ref='pageGroup' :key='index' :config='pageGroupConfig(index)')
                    background-group(:src='[image]')
                    rects-group(v-for='(rects, i) in rectList[index]' :key='i'
                        :pageIndex='index' :index='i' :list='rects'
                        @change='updateRectListItem($event, index, i)')
                    draw-group(:rect='drawingRect')
</template>

<script>
    import {mapGetters} from 'vuex'
    import backgroundGroup from './Background'
    import RectsGroup from './Rects'
    import DrawGroup from './Draw'
    import {STAGE_PADDING} from '../../config'

    export default {
        name: 'paper-marker',
        components: {
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
                questionCreate: {
                    no: null,
                    score: null
                }
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
            updateRectListItem(rects, groupIndex, rectIndex) {
                let newList = this.easyDeepCopy(this.rectList);
                newList[groupIndex][rectIndex] = rects;
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
            createNewRectPrompt(result) {
                const messageVNode = (
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
                    centered: true,
                    scrollable: true
                };
                return new Promise((resolve, reject) => {
                    if (result.groupIndex === 0) {
                        resolve(result)
                    } else {
                        this.$bvModal.msgBoxConfirm([messageVNode], option).then(value => {
                            result.rect.label = `题号 ${this.questionCreate.no} （分数 ${this.questionCreate.score}）`;
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
            endDrawingRect() {
                if (!this.draw.status) {
                    return;
                }

                this.createNewRect(this.draw).then(result => {
                    return this.createNewRectPrompt(result);
                }).then(({pageIndex, groupIndex, rect}) => {
                    this.rectList[pageIndex][groupIndex].push(rect);
                }).finally(() =>{
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
                }).catch(error => {
                    if (error) {
                        this.$bvToast.toast(error, {
                            variant: 'danger',
                            toaster: 'b-toaster-bottom-right',
                            autoHideDelay: 3000,
                            appendToast: false,
                            noCloseButton: true
                        });
                    }
                });
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
        mounted() {
            this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
                if (modalId === 'questionCreateModal' && bvEvent.trigger === 'ok') {
                    if (this.questionCreate.no && this.questionCreate.score) {
                        // console.log(bvEvent)
                    } else {
                        window.alert('请输入题号和分数');
                        bvEvent.preventDefault();
                    }
                }
            })
        },
        created() {
            this.rectList = this.easyDeepCopy(this.list);
            this.updateStageSize();
            window.addEventListener('resize', this.updateStageSize);
        }
    };
</script>

<style scoped lang="sass">
    .marker-stage
        background: #999
</style>
