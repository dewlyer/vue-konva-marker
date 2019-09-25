<template lang="pug">
    v-group(ref='backgroundGroup' :config='config')
        v-image(v-for='(item, index) in list' :key='index' :config='item' @click='handleImageClick')
</template>

<script>
    import {shadow, loadAllImages} from './Background.module'

    export default {
        props: {
            src: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                list: [],
                config: {
                    name: 'backgroundGroup',
                    width: 0,
                    height: 0
                },
                shadow
            };
        },
        methods: {
            handleImageClick(event) {
                const layer = event.target.getLayer();
                layer.find('Transformer').detach();
                layer.batchDraw();
            },
            resetGroupConfig() {
                this.config.width = 0;
                this.config.height = 0;
            },
            updateGroupConfig({x}, {height}) {
                this.config.width = x;
                this.config.height = Math.max(height, this.config.height);
            },
            loadBackground() {
                this.resetGroupConfig();
                return loadAllImages(this.src).then(images => {
                    let coords = {x: 0, y: 0};
                    this.list = images.map(image => {
                        const config = {
                            ...this.shadow,
                            ...coords,
                            image
                        };
                        coords.x += image.width;
                        this.updateGroupConfig(coords, image);
                        return config;
                    });
                });
            }
        },
        watch: {
            src() {
                this.loadBackground();
            }
        },
        created() {
            this.loadBackground();
        }
    };
</script>
