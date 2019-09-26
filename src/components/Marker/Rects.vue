<template lang="pug">
    v-group
        v-group(v-for='(item, index) in rects' :key='item.name' :config='getGroupConfig(item)'
            @transform='handleGroupSizeChanging($event, item)'
            @transformend='handleGroupSizeChanged($event, index)'
            @dragend='handleGroupPositionChange($event, index)'
            @mousedown='handleGroupMouseDown'
            @click='handleRectGroupClick')
            v-text(:config='getTextConfig(item)')
            v-rect(:config='getRectConfig(item)'
                @mouseenter='handleRectMouseEnter'
                @mouseleave='handleRectMouseLeave')
        v-transformer(:config='transformer' @transform='handleTransform')
</template>

<script>
    import {
        rectColors,
        getRectConfig,
        getTransformerConfig,
        getStageCoordsRange
    } from './Rects.module'

    export default {
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            pageIndex: {
                type: Number,
                required: true
            },
            index: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                transformer: null,
                color: null,
                cursorStyle: 'default'
            };
        },
        computed: {
            rects() {
                return !this.list ? [] : this.list.map(rect => ({
                    ...rect,
                    ...getRectConfig(this.pageIndex),
                    draggable: !!rect['editable'],
                    fill: this.color
                }));
            }
        },
        created() {
            this.transformer = getTransformerConfig(this.pageIndex);
            this.color = rectColors[this.index];
        },
        methods: {
            getGroupConfig({x, y, width, height, draggable, dragBoundFunc}) {
                return {x, y, width, height, draggable, dragBoundFunc};
            },
            getTextConfig(item) {
                return {
                    x: 0,
                    y: 0,
                    fontSize: 12,
                    text: item.name
                };
            },
            getRectConfig(item) {
                return {
                    ...item,
                    x: 0,
                    y: 0,
                    draggable: false
                };
            },
            handleRectGroupClick(event) {
                const target = event.currentTarget;
                const parent = target.getParent();
                const page = parent.getParent();
                target.moveToTop();
                parent.moveToTop();
                page.draw();
            },
            handleGroupPositionChange(event, index) {
                const {x, y} = event.target.getAttrs();
                const list = this.list.map((rect, i) => {
                    if (i === index) {
                        rect.x = x;
                        rect.y = y;
                    }
                    return rect;
                });
                this.$emit('change', list);
            },
            handleGroupSizeChanged(event, index) {
                const target = event.target;
                const {scaleX, scaleY} = target.getAttrs();
                const list = this.list.map((rect, i) => {
                    if (i === index) {
                        return {
                            ...rect,
                            scale_x: scaleX,
                            scale_y: scaleY
                        }
                    }
                    return rect;
                });
                this.$emit('change', list);
            },
            handleGroupSizeChanging(event) {
                const target = event.currentTarget;
                const {scaleX, scaleY} = target.getAttrs();
                const rect = target.findOne('Rect');
                const text = target.findOne('Text');
                const rectSize = rect.getClientRect();
                const textSize = text.getClientRect();
                const textVisible = rectSize.width > Math.round(textSize.width) &&
                    rectSize.height > Math.round(textSize.height);

                text.scale({x: 1 / scaleX, y: 1 / scaleY});
                text.visible(textVisible);
            },
            handleGroupMouseDown(event) {
                const rect = event.target;
                const group = event.currentTarget;

                const groupParent = group.getParent();
                const rectParent = rect.getParent();
                const rectClassName = rect.getClassName();

                if (rectClassName !== 'Rect') {
                    return;
                }

                if (!rectParent || rectParent.getClassName() === 'Transformer') {
                    return;
                }

                if (!rect.getAttrs()['editable']) {
                    return;
                }

                const transformerNode = groupParent.findOne('Transformer');
                rect.getLayer().find('Transformer').detach();
                this.updateTransformer(transformerNode, group);
            },
            handleRectMouseEnter(event) {
                if (!event.target.getAttrs()['editable']) {
                    return;
                }

                const container = event.target.getStage().container();
                const style = container.style.cursor;
                if (style) {
                    this.cursorStyle = style;
                }
                container.style.cursor = 'move';
            },
            handleRectMouseLeave(event) {
                const container = event.target.getStage().container();
                container.style.cursor = this.cursorStyle;
            },
            handleTransform(event) {
                const transformer = event.currentTarget;
                const {layerX, layerY} = event.evt;
                const range = getStageCoordsRange(this.pageIndex, transformer.getStage());

                if (layerX < range.x || layerX > range.w) {
                    transformer.stopTransform();
                }

                if (layerY < range.y || layerY > range.h) {
                    transformer.stopTransform();
                }
            },
            updateTransformer(transformerNode, transformerTarget) {
                if (transformerTarget === transformerNode.node()) {
                    return;
                }

                if (transformerTarget) {
                    transformerNode.attachTo(transformerTarget);
                } else {
                    transformerNode.detach();
                }

                transformerNode.getLayer().batchDraw();
            }
        }
    };
</script>
