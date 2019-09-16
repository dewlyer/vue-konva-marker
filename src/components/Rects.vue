<template lang="pug">
    v-layer(ref='rectsLayer')
        v-group(ref='originGroup', v-for='(rects, index) in rectsList', :key='index')
            v-rect(v-for='item in rects', :key='item.name', :config='item',
                @mousedown='handleRectMouseDown($event, index)',
                @mouseenter='handleRectMouseEnter',
                @mouseleave='handleRectMouseLeave',
                @click='handleRectClick')
            v-transformer(:config='transformer', @transform='handleTransform')
        v-group(ref='selectGroup', :config='selectGroupConfig')
            v-transformer(:config='transformer', @transform='handleTransform')
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
        },
        data() {
            return {
                rectColors: rectColors,
                transformer: transformerConfig,
                cursorStyle: 'default',
                selectGroupConfig: {
                    id: 'selectGroup',
                    x: 0,
                    y: 0,
                    draggable: true
                }
            };
        },
        computed: {
            rectsList() {
                return this.list.map((rects, index) => this.getListEx(rects, index));
            }
        },
        methods: {
            getListEx(rects, index) {
                if (!rects) {
                    return [];
                }

                const selectColor = this.rectColors[index];
                const selectStyle = {};
                if (selectColor) {
                    selectStyle.fill = selectColor;
                }
                return rects.map(item => Object.assign(item, rectConfig, selectStyle));
            },
            handleRectClick(event) {
                const targetRect = event.currentTarget;
                const rectGroup = targetRect.getParent();
                const rectLayer = targetRect.getLayer();
                targetRect.moveToTop();
                rectGroup.moveToTop();
                rectLayer.batchDraw();
            },
            handleRectCtrlClick(event, groupIndex) {
                console.log(1)
                const rectsLayer = this.$refs.rectsLayer.getStage();
                const selectGroup = this.$refs.selectGroup.getStage();
                const {x, y} = selectGroup.getPosition();
                const target = event.target;
                const parent = target.getParent();
                const parentId = parent.id();

                target.getLayer().find('Transformer').detach();

                let originIndex = '';
                let originGroup = null;

                // console.log(parent);
                // console.log(parentId);
                // console.log(selectGroup.absolutePosition());
                // console.log(selectGroup.getPosition());

                if (parentId === 'selectGroup') {
                    originIndex = target.getAttr('origin-group-index');
                    originGroup = this.$refs.originGroup[originIndex].getStage();
                    target.draggable(true);
                    target.setAttr('opacity', 0.35);
                    target.move({x: x, y: y});
                    target.moveTo(originGroup);
                } else {
                    target.setAttr('origin-group-index', groupIndex);
                    target.draggable(false);
                    target.setAttr('opacity', 0.6);
                    target.move({x: -x, y: -y});
                    target.moveTo(selectGroup);
                }

                rectsLayer.draw();
            },
            handleRectMouseDown(event, groupIndex) {
                const target = event.target;
                const parent = target.getParent();
                const className = target.getClassName();

                if (event.evt.ctrlKey) {
                    this.handleRectCtrlClick(event, groupIndex);
                    return;
                }

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
