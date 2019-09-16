<template lang="pug">
    v-layer(ref='drawLayer')
        v-rect(:config='rectConfig')
</template>

<script>
    export default {
        props: {
            config: {
                type: Object,
                required: true
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                style: {
                    opacity: 0.9,
                    stroke: '#c00',
                    strokeWidth: 1,
                    dash: [5, 3]
                },
            };
        },
        computed: {
            rectConfig() {
                return {
                    ...this.config,
                    ...this.style,
                    visible: this.visible
                }
            }
        },
        methods: {

        },
        watch: {

        }
    };
</script>
