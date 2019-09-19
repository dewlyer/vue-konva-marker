<template lang="pug">
    .marker-wrapper
        v-stage.marker-stage(ref='stage', :config='stageConfig', :style='stageStyle',
            @mousedown='handleStageMouseDown', @mouseup='handleStageMouseUp',
            @mousemove='handleStageMouseMove', @mouseout='handleStageMouseOut')
            v-layer(v-for='(image, index) in background' :key='index')
                background-group(:src='[image]')
                rects-group(:list='rectList')
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
                default() {
                    return [];
                }
            },
            background: {
                type: Array,
                default() {
                    return [];
                }
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
                drawing: 'marker/drawing',
                scale: 'marker/scale'
            }),
            stageStyle() {
                return {paddingLeft: this.stagePadding + 'px'};
            }
        },
        methods: {
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
            createNewRect(index) {
                const i = index - 1;
                const rect = Object.assign({}, this.drawingRect.config, {
                    name: `rect_${i}_${new Date().getTime()}`
                });
                this.rectList[i].push(rect);
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
                if (!this.drawing) {
                    return;
                }
                this.drawingRect.visible = true;
                this.drawingRect.start = this.getAbsolutePosition(event);
            },
            endDrawingRect() {
                if (!this.drawing) {
                    return;
                }
                this.drawingRect.visible = false;
                this.createNewRect(this.drawing);
                this.$emit('update:list', this.easyDeepCopy(this.rectList));
                this.resetDrawingStatus();
                this.$store.commit('marker/toggleDrawing', {
                    drawing: false
                });
            },
            doDrawingRect(event) {
                if (!this.drawing) {
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
            drawing(value) {
                const container = this.$refs.stage.getStage().container();
                container.style.cursor = value ? 'crosshair' : 'default';
                this.stageConfig.draggable = !value;
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
