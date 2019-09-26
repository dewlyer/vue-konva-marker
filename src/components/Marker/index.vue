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
            createNewRect({status, groupIndex, rectId, editable}) {
                if (!status) {
                    return;
                }

                if (this.$refs.stage.getStage().findOne('.' + rectId)) {
                    this.$bvToast.toast('标记已存在，请删除原标记再添加！', {
                        variant: 'danger',
                        toaster: 'b-toaster-bottom-right',
                        autoHideDelay: 3000,
                        appendToast: false,
                        noCloseButton: true
                    });
                    return;
                }

                const p = this.showIndex;
                const i = groupIndex;
                const id = rectId || `paper${p}_group${i}_x${new Date().getTime()}`;

                this.rectList[p][i].push({
                    ...this.drawingRect.config,
                    name: id,
                    editable: !!editable
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
                this.drawingRect.visible = false;
                this.createNewRect(this.draw);
                this.resetDrawingStatus();
                this.$store.commit('marker/updateDraw', {
                    draw: {
                        status: false,
                        editable: false,
                        groupIndex: null,
                        rectId: null
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
