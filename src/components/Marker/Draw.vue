<template lang="pug">
    v-layer(ref='drawLayer')
        v-rect(:config='config')
</template>

<script>
    const style = {
        opacity: 0.9,
        stroke: '#c00',
        strokeWidth: 1,
        dash: [5, 3]
    };
    export default {
        props: {
            rect: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                style
            };
        },
        computed: {
            config() {
                return {
                    ...this.style,
                    ...this.rect.config,
                    visible: this.rect.visible
                }
            }
        }
    };
</script>
