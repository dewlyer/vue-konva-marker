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
                return this;
            },
            updateGroupConfig(x, height) {
                this.config.width = x;
                this.config.height = Math.max(height, this.config.height);
            },
            async loadAllImages() {
                return await loadAllImages(this.src);
            },
            async loadBackground() {
                let config = {...this.shadow, x: 0, y: 0};
                const images = await this.resetGroupConfig().loadAllImages();
                this.list = images.map(image => {
                    let cfg = {...config, image};
                    config.x += image.width;
                    this.updateGroupConfig(config.x, image.height);
                    return cfg;
                });
                return images;
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
