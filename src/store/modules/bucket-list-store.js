import {
  fetchPrefixList,
  fetchPrefixListMeta,
  createPrefix,
  uploadPrefixListMeta,
  deletePrefix
} from '@/api/prefix-api';
import { moveItemInArray } from '@/services/sort-order-service';

const state = {
  itemsByName: {},
  itemsSortOrder: [],
  selectedItemName: undefined
};

const getters = {
  items: state => state.itemsSortOrder.map(itemName => state.itemsByName[itemName]),
  meta: state => ({ sortOrder: state.itemsSortOrder })
};

const actions = {
  fetchItems({ commit }) {
    const fetchPrefixListPromise = fetchPrefixList().catch(err => {
      // TODO: handle error
      console.error(err);
    });

    const fetchPrefixListMetaPromise = fetchPrefixListMeta().catch(err => {
      // TODO: handle error
      console.error(err);
      return {};
    });

    Promise.all([fetchPrefixListPromise, fetchPrefixListMetaPromise]).then(
      ([prefixList, prefixListMeta]) => {
        if (!prefixList || !prefixList.length) return;
        commit('setItems', { items: prefixList });
        commit('setItemsSortOrder', { sortOrder: prefixListMeta.sortOrder });
        const selectedItem = prefixListMeta.sortOrder ? prefixListMeta.sortOrder[0] : prefixList[0];
        commit('selectItem', { itemName: selectedItem });
      }
    );
  },
  createItem({ commit }, payload) {
    createPrefix(payload.bucketName)
      .then(() => {
        const item = { name: payload.bucketName };
        commit('addItems', { items: [item] });
        commit('selectItem', { itemName: payload.bucketName });
      })
      .catch(err => {
        // TODO: handle error
        console.error(err);
      });
  },
  deleteItem({ commit, getters }, payload) {
    // TODO: check if empty, ask then delete objects if not
    // TODO: commit spinner while deleting
    deletePrefix(payload.bucketName)
      .then(() => {
        commit('deleteItem', payload);
        commit('selectItem', { itemName: getters.meta.sortOrder[0] });
        uploadPrefixListMeta(getters.meta).catch(err => {
          // TODO: handle err
          console.error(err);
        });
      })
      .catch(err => console.log('Error deleting bucket', err));
  },
  updateItemsSortOrder({ commit, getters }, payload) {
    commit('updateItemsSortOrder', payload);
    uploadPrefixListMeta(getters.meta).catch(err => {
      // TODO: handle err
      console.error(err);
    });
  }
};

const mutations = {
  setItems(state, payload) {
    let itemsByName = {};
    payload.items.forEach(item => (itemsByName[item] = { name: item }));
    state.itemsByName = itemsByName;
  },
  addItems(state, payload) {
    let itemsByName = {};
    payload.items.forEach(item => (itemsByName[item.name] = item));
    state.itemsByName = { ...state.itemsByName, ...itemsByName };
    state.itemsSortOrder = [...payload.items.map(item => item.name), ...state.itemsSortOrder];
  },
  deleteItem(state, payload) {
    const { bucketName } = payload;
    state.selectedItemName = undefined;
    state.itemsSortOrder = state.itemsSortOrder.filter(item => item !== bucketName);
    state.itemsByName = { ...state.itemsByName, [bucketName]: undefined };
  },
  selectItem(state, payload) {
    state.selectedItemName = payload.itemName;
  },
  setItemsSortOrder(state, payload) {
    const itemNames = Object.keys(state.itemsByName);
    const sortOrder = payload.sortOrder || itemNames;
    if (sortOrder.length && itemNames.length) {
      const filteredSortOrder = sortOrder.filter(itemName => itemNames.includes(itemName));
      const uniqueSortOrder = new Set([...filteredSortOrder, ...itemNames]);
      state.itemsSortOrder = Array.from(uniqueSortOrder);
    }
  },
  updateItemsSortOrder(state, payload) {
    state.itemsSortOrder = moveItemInArray(
      state.itemsSortOrder,
      payload.fromIndex,
      payload.toIndex
    );
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
