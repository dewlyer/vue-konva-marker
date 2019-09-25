<template lang="pug">
    v-group
        v-rect(v-for='(item, index) in rects' :key='item.name' :config='item'
            @mousedown='handleRectMouseDown'
            @mouseenter='handleRectMouseEnter'
            @mouseleave='handleRectMouseLeave'
            @dragend='handleRectDataChange($event, index)'
            @transformend='handleRectDataChange($event, index)'
            @click='handleRectClick')
        v-transformer(:config='transformer' @transform='handleTransform')
</template>

<script>
    import {
        rectColors, rectConfig, transformerConfig,
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
            index: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                transformer: transformerConfig,
                color: null,
                cursorStyle: 'default'
            };
        },
        computed: {
            rects() {
                return !this.list ? [] : this.list.map(rect => ({
                    ...rect,
                    ...rectConfig,
                    fill: this.color
                }));
            }
        },
        created() {
            this.color = rectColors[this.index];
        },
        methods: {
            handleRectDataChange(event, index) {
                const target = event.target;
                const {x, y, width, height, scaleX, scaleY} = target.attrs;
                const rectAttr = {x, y, width: Math.round(width * scaleX), height: Math.round(height * scaleY)};
                const list = this.list.map((rect, i) => i === index ? Object.assign({}, rect, rectAttr) : rect);
                target.scale({x: 1, y: 1});
                this.$emit('update', list);
            },
            handleRectClick(event) {
                const targetRect = event.currentTarget;
                const rectGroup = targetRect.getParent();
                const rectLayer = targetRect.getLayer();
                targetRect.moveToTop();
                rectGroup.moveToTop();
                rectLayer.batchDraw();
            },
            handleRectMouseDown(event) {
                const target = event.target;
                const parent = target.getParent();
                const className = target.getClassName();

                // if (event.evt.ctrlKey) {
                //     this.handleRectCtrlClick(event, groupIndex);
                //     return;
                // }

                if (!parent || parent.getClassName() === 'Transformer') {
                    return;
                }

                if (className !== 'Rect') {
                    return;
                }

                const transformerNode = parent.findOne('Transformer');
                const selectedRect = target.name();

                target.getLayer().find('Transformer').detach();
                this.updateTransformer(transformerNode, selectedRect);
            },
            handleRectMouseEnter(event) {
                const container = event.target.getStage().container();
                if (container.style.cursor) {
                    this.cursorStyle = container.style.cursor;
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
                const range = getStageCoordsRange(transformer.getStage());

                if (layerX < range.x || layerX > range.w) {
                    transformer.stopTransform();
                }

                if (layerY < range.y || layerY > range.h) {
                    transformer.stopTransform();
                }
            },
            updateTransformer(transformerNode, selectedRect) {
                const stage = transformerNode.getStage();
                const selectedNode = stage.findOne('.' + selectedRect);

                if (selectedNode === transformerNode.node()) {
                    return;
                }

                if (selectedNode) {
                    transformerNode.attachTo(selectedNode);
                } else {
                    transformerNode.detach();
                }

                transformerNode.getLayer().batchDraw();
            }
        }
    };
</script>
