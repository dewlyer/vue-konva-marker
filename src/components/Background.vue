<template>
    <v-group ref="backgroundGroup" :config="config">
        <v-image v-for="(item, index) in imageList" :key="index" :config="item"></v-image>
    </v-group>
</template>

<script>
    export default {
        props: {
            src: Array
        },
        data() {
            return {
                imageList: [],
                config: {
                    id: 'backgroundGroup'
                }
            };
        },
        watch: {
            src() {
                this.loadBackgroundImages();
            }
        },
        methods: {
            loadBackgroundImages() {
                this.loadAllImages().then(imageList => {
                    let x = 0, y = 0;
                    this.imageList = imageList.map(image => {
                        let config = {x, y, image};
                        x += image.width;
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

<style scoped lang="scss">
</style>
