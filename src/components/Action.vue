<template>
    <div class="btn-wrapper">
        <input v-for="(item, index) in colors" :key="index" :value="item" type="button" class="button-draw"
               @click="handleDrawStart(index)"/>
        <input type="button" class="button-draw button-image" value="换图"/>
        <input type="file" class="input-image" multiple @change="loadLocalImages"/>
    </div>
</template>

<script>
    const COLORS = ['绿框', '蓝框', '红框'];
    export default {
        name: 'paper-action',
        data() {
            return {
                colors: COLORS
            }
        },
        methods: {
            handleDrawStart(index) {
                this.$emit('drawstart', index + 1);
            },
            loadLocalImages(e) {
                this.readAllImageFiles(e.target.files).then(files => {
                    if (files && files.length) {
                        this.$emit('change', files);
                    }
                });
            },
            readAllImageFiles(files) {
                return Promise.all(Array.prototype.map.call(files, file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target['result']);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })));
            }
        }
    }
</script>
