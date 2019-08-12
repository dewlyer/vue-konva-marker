<template>
    <v-stage class="marker-stage" ref="stage" :config="stageConfig"
             @mousedown="handleStageMouseDown" @mouseup="handleStageMouseUp"
             @mousemove="handleStageMouseMove" @mouseout="handleStageMouseOut">

        <v-layer ref="backgroundLayer">
            <background-group :src="background"/>
        </v-layer>

        <v-layer ref="rectsLayer">
            <rects-group v-for="(item, index) in rectList"
                         :key="index" :index="index" :list="item"
                         :selected="rectListSelectName"/>
        </v-layer>

        <v-layer ref="drawLayer">
            <v-rect :config="drawingRectConfig"></v-rect>
        </v-layer>

    </v-stage>
</template>

<script>
    import BackgroundGroup from './Background'
    import RectsGroup from './Rects'

    const RECT_LIST = [
        [
            {
                name: 'recta1',
                x: 120,
                y: 120,
                width: 100,
                height: 100,
            },
            {
                name: 'recta2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ],
        [
            {
                name: 'rectb1',
                x: 120,
                y: 220,
                width: 100,
                height: 100,
            },
            {
                name: 'rectb2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ],
        [
            {
                name: 'rectc1',
                x: 120,
                y: 320,
                width: 100,
                height: 100,
            },
            {
                name: 'rectc2',
                x: 550,
                y: 180,
                width: 300,
                height: 158,
            }
        ]
    ];

    export default {
        name: 'paper-marker',
        components: {
            BackgroundGroup,
            RectsGroup
        },
        props: {
            background: {
                type: Array,
                default() {
                    return [];
                }
            },
            drawing: {
                type: [Number, Boolean],
                default: false
            }
        },
        data() {
            return {
                stageConfig: {
                    width: 0,
                    height: 0,
                    draggable: true
                },
                rectList: RECT_LIST,
                rectListSelectName: '',
                drawingRect: {
                    base: {
                        name: 'rectDrawing',
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    },
                    style: {
                        opacity: 0.9,
                        stroke: '#c00',
                        strokeWidth: 1,
                        dash: [5, 3]
                    },
                    visible: false,
                    start: null,
                    end: null,
                }
            };
        },
        computed: {
            drawingRectConfig() {
                return {
                    ...this.drawingRect.base,
                    ...this.drawingRect.style,
                    visible: this.drawingRect.visible
                }
            }
        },
        methods: {
            updateStageSize() {
                this.stageConfig.width = window.innerWidth;
                this.stageConfig.height = window.innerHeight;
            },
            createNewRect(index) {
                const i = index - 1;
                const rect = Object.assign({}, this.drawingRect.base, {
                    name: `rect_${i}_${new Date().getTime()}`
                });
                this.rectList[i].push(rect);
            },
            getAbsolutePosition(event) {
                const stage = event.target.getStage();
                return stage.getPointerPosition();
            },
            updateDrawingRect() {
                if (!this.drawingRect.start || !this.drawingRect.end) {
                    return;
                }

                let stage = this.$refs.stage.getStage();
                let x = stage.x();
                let y = stage.y();
                let drawStart = this.drawingRect.start;
                let drawEnd = this.drawingRect.end;
                Object.assign(this.drawingRect.base, {
                    x: Math.min(drawStart.x, drawEnd.x) - x,
                    y: Math.min(drawStart.y, drawEnd.y) - y,
                    width: Math.abs(drawStart.x - drawEnd.x),
                    height: Math.abs(drawStart.y - drawEnd.y)
                });
            },
            resetDrawingStatus() {
                this.drawingRect.start = null;
                this.drawingRect.end = null;
                this.drawingRect.base.x = 0;
                this.drawingRect.base.y = 0;
                this.drawingRect.base.width = 0;
                this.drawingRect.base.height = 0;
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
                this.resetDrawingStatus();
                this.$emit('drawend');
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
                const parent = target.getParent();
                const className = target.getClassName();

                if (parent && parent.getClassName() !== 'Transformer') {
                    this.rectListSelectName = className === 'Rect' ? target.name() : '';
                }

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
            handleStageMouseOut() {},
        },
        watch: {
            drawing(value) {
                const container = this.$refs.stage.getStage().container();
                container.style.cursor = value ? 'crosshair' : 'default';
                this.stageConfig.draggable = !value;
            }
        },
        created() {
            window.addEventListener('resize', this.updateStageSize);
            this.updateStageSize();
        }
    };
</script>

<style scoped lang="scss">
    .marker-stage {
        background: #999;
    }
</style>
