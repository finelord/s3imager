const state = {
  endpoint: '',
  useSSL: true,
  bucket: '',
  cloudFrontUrl: ''
};

const getters = {
  baseUrl: state => {
    // TODO: figure out if this is correct
    const protocol = state.useSSL ? 'https' : 'http';
    const url = state.cloudFrontUrl || `${state.bucket}.${state.endpoint}`;
    return `${protocol}://${url}`;
  }
};

const actions = {
  initContext({ commit }, payload) {
    commit('setEndpoint', { endpoint: payload.endpoint });
    commit('setUseSSL', { useSSL: payload.useSSL });
    commit('setBucket', { bucket: payload.bucket });
    commit('setCloudFrontUrl', { cloudFrontUrl: payload.cloudFrontUrl });
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
  },
  setCloudFrontUrl(state, payload) {
    state.cloudFrontUrl = payload.cloudFrontUrl;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
