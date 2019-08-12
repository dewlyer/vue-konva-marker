<template>
    <v-rect :config="rectConfig"></v-rect>
</template>

<script>
    export default {
        name: 'draw',
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
