const state = {
    drawing: false,
    scale: 1
};

const mutations = {
    toggleDrawing(state, {drawing}) {
        state.drawing = drawing;
    },
    updateScale(state, {scale}) {
        state.scale = scale;
    }
};

const actions = {};

const getters = {
    drawing: state => state.drawing,
    scale: state => state.scale
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
