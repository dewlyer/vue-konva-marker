const state = {
    draw: {
        status: false,
        groupIndex: null,
        rectId: null
    },
    scale: 1
};

const mutations = {
    updateDraw(state, {draw}) {
        state.draw = draw;
    },
    updateScale(state, {scale}) {
        state.scale = scale;
    }
};

const actions = {};

const getters = {
    draw: state => state.draw,
    scale: state => state.scale
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
