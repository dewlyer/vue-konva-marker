const state = {
    draw: {
        status: false,
        rectId: null,
        label: null,
        groupIndex: null,
        editable: false,
        attrs: {}
    },
    scale: 1
};

const mutations = {
    restoreDraw(state) {
        state.draw = {
            status: false,
            rectId: null,
            label: null,
            groupIndex: null,
            editable: false,
            attrs: {}
        };
    },
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
