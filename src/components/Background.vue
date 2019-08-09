<template>
    <v-group ref="backgroundGroup" :config="config">
        <v-image v-for="(item, index) in list" :key="index" :config="item"/>
    </v-group>
</template>

<script>
    export default {
        props: {
            src: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                config: {
                    name: 'backgroundGroup',
                    width: 0,
                    height: 0
                },
                list: []
            };
        },
        watch: {
            src() {
                this.loadBackgroundImages();
            }
        },
        methods: {
            updateGroupConfig({x, y}, {width, height}) {
                this.config.width = x;
                this.config.height = Math.max(height, this.config.height);
            },
            loadBackgroundImages() {
                this.loadAllImages().then(images => {
                    let coords = {x: 0, y: 0};
                    this.list = images.map(image => {
                        const config = {...coords, image};
                        coords.x += image.width;
                        this.updateGroupConfig(coords, image);
                        return config;
                    });
                });
            },
            loadAllImages() {
                return Promise.all(this.src.map(url => this.createPromise(url)));
            },
            createPromise(url) {
                return new Promise((resolve, reject) => {
                    const image = new window.Image();
                    image.onload = () => resolve(image);
                    image.onerror = reject;
                    image.src = url;
                });
            }
        },
        created() {
            this.loadBackgroundImages();
        }
    };
</script>
