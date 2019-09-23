import Vue from 'vue'
import Vuex from 'vuex'
import marker from './marker'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        marker
    }
})
