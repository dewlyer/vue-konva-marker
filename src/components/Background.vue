<template>
    <v-layer ref="backgroundLayer">
        <v-image :config="background"></v-image>
    </v-layer>
</template>

<script>
    import Download from '../assets/download.jpg';

    export default {
        data() {
            return {
                background: {
                    image: null
                }
            };
        },
        created() {
            const backgroundImage = new window.Image();
            backgroundImage.src = Download;
            backgroundImage.onload = () => {
                this.background.image = backgroundImage;
            };
        },
        methods: {}
    };
</script>

<style scoped lang="scss">
</style>
