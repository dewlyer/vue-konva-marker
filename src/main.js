import Vue from 'vue'
import VueKonva from 'vue-konva'
import App from './App'
import store from './store/store'

Vue.use(VueKonva)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
