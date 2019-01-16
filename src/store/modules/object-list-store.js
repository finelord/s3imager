import {
  fetchObjectList,
  fetchObjectListSortOrder,
  uploadObjectListSortOrder
} from '@/api/object-api';
import { moveItemInArray } from '@/services/sort-order-service';

const state = {
  itemsByName: {},
  itemsSortOrder: []
};

const getters = {
  items: state => state.itemsSortOrder.map(itemName => state.itemsByName[itemName]),
  itemsSortOrder: state => state.itemsSortOrder
};

const actions = {
  fetchItems({ commit }, payload) {
    commit('clearItems');

    // TODO: concider if we need to check if bucket exists

    const fetchObjectListPromise = fetchObjectList(payload.bucketName).catch(err => {
      // TODO: handle error
      console.error(err);
    });

    const fetchSortOrderPromise = fetchObjectListSortOrder(payload.bucketName).catch(err => {
      // TODO: handle err
      console.error(err);
    });

    Promise.all([fetchObjectListPromise, fetchSortOrderPromise]).then(
      ([objectList, objectListSortOrder]) => {
        if (!objectList) return;
        commit('setItems', { items: objectList });
        commit('setItemsSortOrder', { itemsSortOrder: objectListSortOrder });
      }
    );
  },
  updateItemsSortOrder({ commit, getters }, payload) {
    commit('updateItemsSortOrder', payload);
    uploadObjectListSortOrder(payload.bucketName, getters.itemsSortOrder).catch(err => {
      // TODO: handle err
      console.error(err);
    });
  }
};

const mutations = {
  setItems(state, payload) {
    const itemsByName = {};
    payload.items.forEach(item => (itemsByName[item.name] = item));
    state.itemsByName = itemsByName;
  },
  clearItems() {
    state.itemsByName = {};
    state.itemsSortOrder = [];
  },
  setItemsSortOrder(state, payload) {
    const itemNames = Object.keys(state.itemsByName);
    const itemsSortOrder = payload.itemsSortOrder || itemNames;
    if (itemsSortOrder.length && itemNames.length) {
      const filteredSortOrder = itemsSortOrder.filter(itemName => itemNames.includes(itemName));
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
