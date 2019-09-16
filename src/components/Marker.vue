<template lang="pug">
    v-stage.marker-stage(ref='stage', :config='stageConfig',
        @mousedown='handleStageMouseDown', @mouseup='handleStageMouseUp',
        @mousemove='handleStageMouseMove', @mouseout='handleStageMouseOut')
        background-layer(:src='background')
        rects-layer(:list='rectList')
        draw-layer(:rect='drawingRect')
</template>

<script>
    import {mapGetters} from 'vuex'
    import BackgroundLayer from './Background'
    import RectsLayer from './Rects'
    import DrawLayer from './Draw'

    export default {
        name: 'paper-marker',
        components: {
            BackgroundLayer,
            RectsLayer,
            DrawLayer
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
        computed: mapGetters({
            drawing: 'marker/drawing',
            scale: 'marker/scale'
        }),
        methods: {
            updateStageSize() {
                this.stageConfig.width = window.innerWidth;
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
                this.$emit('change', this.rectList);
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
            handleStageMouseOut() {}
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
            this.rectList = this.list;
            this.updateStageSize();
            window.addEventListener('resize', this.updateStageSize);
        }
    };
</script>

<style scoped lang="scss">
    .marker-stage {
        background: #999;
    }
</style>
