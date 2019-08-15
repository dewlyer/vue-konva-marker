import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App'
import store from './store'

Vue.config.performance = true;

Vue.config.productionTip = false;

Vue.use(VueKonva);

new Vue({
    store,
    el: '#app',
    render: h => h(App)
});
