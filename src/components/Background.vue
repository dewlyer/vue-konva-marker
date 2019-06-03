<template>
    <v-layer ref="backgroundLayer">
        <v-image :config="background"></v-image>
    </v-layer>
</template>

<script>
    export default {
        props: {
            src: Array
        },
        data() {
            return {
                background: {
                    image: null
                }
            };
        },
        created() {
            this.loadBackgroundImages();
        },
        methods: {
            loadBackgroundImages() {
                this.createImagePromises().then((src) => {
                    src.forEach(image => {
                        console.log(image)
                        this.background.image = image;
                    });
                });
            },
            createImagePromises() {
                let promises = [];
                this.src.forEach(url => promises.push(this.createPromise(url)));
                return Promise.all(promises);
            },
            createPromise(url) {
                return new Promise((resolve, reject) => {
                    const image = new window.Image();
                    image.onload = () => resolve(image);
                    image.onerror = reject;
                    image.src = url;
                });
            }
        }
    };
</script>

<style scoped lang="scss">
</style>
