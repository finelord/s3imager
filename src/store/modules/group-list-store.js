import {
  fetchObjectList,
  fetchGroupListSortOrder,
  uploadGroupListSortOrder,
  deleteObject,
  deleteObjectList
} from '@/api/object-api';
import { parseImageId } from '@/services/id-service';
import { moveItemInArray } from '@/services/sort-order-service';

const state = {
  itemsById: {},
  itemsSortOrder: [],
  selectedItemIds: [],
  invalidItems: []
};

const getters = {
  items: state => state.itemsSortOrder.map(itemId => state.itemsById[itemId]),
  selectedItems: state => state.selectedItemIds.map(itemId => state.itemsById[itemId]),
  // TODO: extract logic
  groups: state => {
    return state.itemsSortOrder.map(itemId => {
      const items = state.itemsById[itemId];
      // TODO: get correct items for previews
      const previews = {
        '1x': items[0],
        '2x': items[0]
      };
      return { id: itemId, name: 'noname', items, previews };
    });
  },
  itemsSortOrder: state => state.itemsSortOrder,
  isItemSelected: state => itemId => state.selectedItemIds.includes(itemId),
  invalidItems: state => state.invalidItems
};

const actions = {
  fetchItems({ commit }, payload) {
    commit('clearItems');

    const { bucketName } = payload;

    if (!bucketName) return;

    // TODO: concider if we need to check if bucket exists

    const fetchObjectListPromise = fetchObjectList(bucketName).catch(err => {
      // TODO: handle error
      console.error(err);
    });

    const fetchSortOrderPromise = fetchGroupListSortOrder(bucketName).catch(err => {
      // TODO: handle err
      console.error(err);
    });

    Promise.all([fetchObjectListPromise, fetchSortOrderPromise]).then(
      ([objectList, groupListSortOrder]) => {
        if (!objectList) return;
        commit('setItems', { items: objectList });
        commit('setItemsSortOrder', { itemsSortOrder: groupListSortOrder });
      }
    );
  },
  updateItemsSortOrder({ commit, getters }, payload) {
    commit('updateItemsSortOrder', payload);
    uploadGroupListSortOrder(payload.bucketName, getters.itemsSortOrder).catch(err => {
      // TODO: handle err
      console.error(err);
    });
  },
  deleteItem({ commit }, payload) {
    // TODO: commit spinner
    deleteObject(payload.bucketName, payload.imageName)
      .then(() => commit('deleteItem', payload))
      .catch(); // TODO: utilize
  },
  deleteItemGroup({ commit }, payload) {
    // TODO: commit spinner
    const { bucketName, groupId } = payload;
    const objectList = state.itemsById[groupId].map(item => item.name);
    deleteObjectList(bucketName, objectList)
      .then(() => commit('deleteItemList', payload))
      .catch(); // TODO: utilize
  }
};

const mutations = {
  setItems(state, payload) {
    const itemsById = {};
    const invalidItems = [];
    payload.items.forEach(item => {
      const parsedImageId = parseImageId(item.name);
      if (parsedImageId) {
        const { groupId, configId, width, height } = parsedImageId;
        const enrichedItem = { ...item, configId, width, height };
        itemsById[groupId] = [...(itemsById[groupId] || []), enrichedItem];
      } else {
        invalidItems.push(item);
      }
    });
    state.itemsById = itemsById;
    state.invalidItems = invalidItems;
  },
  setItemsSortOrder(state, payload) {
    const itemNames = Object.keys(state.itemsById);
    const itemsSortOrder = payload.itemsSortOrder || itemNames;
    if (itemsSortOrder.length && itemNames.length) {
      const filteredSortOrder = itemsSortOrder.filter(itemName => itemNames.includes(itemName));
      const uniqueSortOrder = new Set([...filteredSortOrder, ...itemNames]);
      state.itemsSortOrder = Array.from(uniqueSortOrder);
      state.selectedItemIds = Array.from(uniqueSortOrder);
    }
  },
  deleteItem(state, payload) {
    const { groupId, imageName } = payload;
    state.itemsById = {
      ...state.itemsById,
      [groupId]: state.itemsById[groupId].filter(image => image.name !== imageName)
    };
    if (state.itemsById[groupId].length) return;
    state.itemsSortOrder = state.itemsSortOrder.filter(id => id !== groupId);
    state.selectedItemIds = state.selectedItemIds.filter(id => id !== groupId);
    state.itemsById = { ...state.itemsById, [groupId]: undefined };
  },
  deleteItemList(state, payload) {
    const { groupId } = payload;
    state.itemsSortOrder = state.itemsSortOrder.filter(id => id !== groupId);
    state.selectedItemIds = state.selectedItemIds.filter(id => id !== groupId);
    state.itemsById = { ...state.itemsById, [groupId]: undefined };
  },
  clearItems() {
    state.itemsById = {};
    state.itemsSortOrder = [];
    state.selectedItemIds = [];
    state.invalidItems = [];
  },
  toggleItemSelection(state, payload) {
    const { itemId } = payload;
    const selectedItemsSet = new Set(state.selectedItemIds);
    selectedItemsSet.has(itemId) ? selectedItemsSet.delete(itemId) : selectedItemsSet.add(itemId);
    state.selectedItemIds = Array.from(selectedItemsSet);
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
