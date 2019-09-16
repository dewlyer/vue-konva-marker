<template lang="pug">
    v-layer(ref='drawLayer')
        v-rect(:config='config')
</template>

<script>
    import {style} from './Draw.module';

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
