import { fetchObjectUploaderConfigMeta, uploadObjectUploaderConfigMeta } from '@/api/prefix-api';

const DEFAULT_PRESET = {
  default: {
    name: 'default',
    value: [
      {
        id: 'original',
        resize: false
      }
    ]
  }
};

const state = {
  itemsByName: { ...DEFAULT_PRESET },
  selectedItemName: 'default'
};

const getters = {
  selectedItem: state => state.itemsByName[state.selectedItemName],
  itemsSortOrder: state => Object.keys(state.itemsByName)
};

const actions = {
  fetchItems({ commit }) {
    commit('clearItems');

    // TODO: concider if we need to check if bucket exists

    fetchObjectUploaderConfigMeta()
      .then(objectUploaderConfig => {
        commit('setItems', { config: objectUploaderConfig });
      })
      .catch(err => {
        // TODO: handle error
        console.error(err);
      });
  },
  saveItems({ state }) {
    const meta = { presetsByName: state.itemsByName, selectedPresetName: state.selectedItemName };
    uploadObjectUploaderConfigMeta(meta)
      .then() // TODO: utilize
      .catch(err => console.error(err));
  }
};

const mutations = {
  setItems(state, payload) {
    const config = payload.config || {};
    state.itemsByName = {
      ...DEFAULT_PRESET,
      ...(config.presetsByName || {})
    };
    state.selectedItemName = config.selectedPresetName || 'default';
  },
  addItem(state) {
    state.itemsByName = {
      ...state.itemsByName,
      new: {
        ...DEFAULT_PRESET.default,
        name: 'new'
      }
    };
    state.selectedItemName = 'new';
  },
  deleteItem(state) {
    const itemToDelete = state.selectedItemName;
    state.selectedItemName = 'default';
    delete state.itemsByName[itemToDelete];
    state.itemsByName = { ...state.itemsByName };
  },
  selectItem(state, payload) {
    state.selectedItemName = payload.presetName;
  },
  updateItem(state, payload) {
    const presetName = payload.preset.name;
    state.itemsByName = {
      ...state.itemsByName,
      [presetName]: payload.preset
    };
    if (state.selectedItemName !== presetName) {
      const delPresetName = state.selectedItemName;
      state.selectedItemName = presetName;
      delete state.itemsByName[delPresetName];
      state.itemsByName = { ...state.itemsByName };
    }
  },
  clearItems() {
    state.itemsByName = { ...DEFAULT_PRESET };
    state.selectedItemName = 'default';
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
