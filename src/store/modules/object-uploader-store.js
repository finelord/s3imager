import {
  uploadArrayBufferObject,
  fetchGroupListSortOrder,
  uploadGroupListSortOrder
} from '@/api/object-api';
import { resizeImage } from '@/services/image-resize-service';
import { generateGroupId, generateImageId } from '@/services/id-service';
import { moveItemInArray } from '@/services/sort-order-service';
import { convertImageToArrayBuffer, convertFileToImage } from '@/services/data-converter-service';

const state = {
  imagesByName: {},
  previewsByName: {},
  imagesSortOrder: [],
  groupIds: [],
  uploadedImagesMeta: []
};

const getters = {
  images: state => state.imagesSortOrder.map(itemName => state.imagesByName[itemName]),
  previews: state => state.imagesSortOrder.map(itemName => state.previewsByName[itemName])
};

const actions = {
  readFiles({ commit }, payload) {
    commit('addImages', payload);
    commit('generatePreviews');
  },
  async uploadImages({ commit, getters }, payload) {
    const { configSet, bucketName } = payload;

    const images = [...getters.images];
    const uploadPromises = [];

    for (const image of images) {
      const imageName = image.name;
      const groupId = generateGroupId();
      commit('addGroupId', { groupId });

      let configIterationsCnt = configSet.value.length;
      for (const config of configSet.value) {
        let blob, meta;
        if (config.resize) {
          // process images one by one for better resize performance
          [blob, meta] = await resizeImage(image, config).catch(err => {
            // TODO: handle err
            console.error(err);
          });
        } else {
          blob = image;
          meta = await convertFileToImage(image);
        }

        if (!blob) break;

        const objectId = generateImageId(groupId, config.id, meta.width, meta.height);
        const objectName = `${objectId}.jpg`;
        const object = await convertImageToArrayBuffer(blob).catch(err => {
          // TODO: handle err
          console.error(err);
        });

        const uploadPromise = uploadArrayBufferObject(bucketName, objectName, object)
          .then(etag => {
            commit('addUploadedImageMeta', {
              imageMeta: {
                imageId: objectName,
                size: blob.size,
                md5: etag
              }
            });
            configIterationsCnt--;
            if (configIterationsCnt === 0) {
              commit('removeImage', { imageName });
            }
          })
          .catch(err => {
            // TODO: handle err
            console.error(err);
          });
        uploadPromises.push(uploadPromise);
      }
    }

    Promise.all(uploadPromises).then(async () => {
      // TODO: update bucket meta
      const groupListSortOrder = await fetchGroupListSortOrder(bucketName).catch(() => []);
      const updatedSortOrder = [...(groupListSortOrder || []), ...state.groupIds];
      await uploadGroupListSortOrder(bucketName, updatedSortOrder);
      console.log('+++ DONE +++');
    });
  }
};

const mutations = {
  addImages(state, payload) {
    const imagesByName = {};
    payload.files
      .filter(file => file.type.match('image.*'))
      .forEach(item => (imagesByName[item.name] = item));
    state.imagesByName = imagesByName;
    state.imagesSortOrder = Object.keys(imagesByName);
  },
  removeImage(state, payload) {
    state.imagesSortOrder = state.imagesSortOrder.filter(
      itemName => itemName !== payload.imageName
    );
  },
  generatePreviews(state) {
    const previewsByName = {};
    state.imagesSortOrder.forEach(
      itemName => (previewsByName[itemName] = URL.createObjectURL(state.imagesByName[itemName]))
    );
    state.previewsByName = previewsByName;
  },
  updateImagesSortOrder(state, payload) {
    state.imagesSortOrder = moveItemInArray(
      state.imagesSortOrder,
      payload.fromIndex,
      payload.toIndex
    );
  },
  addGroupId(state, payload) {
    state.groupIds.push(payload.groupId);
  },
  addUploadedImageMeta(state, payload) {
    state.uploadedImagesMeta = [...state.uploadedImagesMeta, payload.imageMeta];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
