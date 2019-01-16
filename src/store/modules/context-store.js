const state = {
  endpoint: '',
  useSSL: true,
  bucket: ''
};

const getters = {
  baseUrl: state => `${state.useSSL ? 'https' : 'http'}://${state.bucket}.${state.endpoint}`
};

const actions = {
  initContext({ commit }, payload) {
    commit('setEndpoint', { endpoint: payload.endpoint });
    commit('setUseSSL', { useSSL: payload.useSSL });
    commit('setBucket', { bucket: payload.bucket });
  }
};

const mutations = {
  setEndpoint(state, payload) {
    state.endpoint = payload.endpoint;
  },
  setUseSSL(state, payload) {
    state.useSSL = payload.useSSL;
  },
  setBucket(state, payload) {
    state.bucket = payload.bucket;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
