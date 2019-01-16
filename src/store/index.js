import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import context from './modules/context-store';
import bucketList from './modules/bucket-list-store';
import groupList from './modules/group-list-store';
import objectList from './modules/object-list-store';
import objectUploader from './modules/object-uploader-store';
import objectUploaderConfig from './modules/object-uploader-config-store';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    context,
    bucketList,
    groupList,
    objectList,
    objectUploader,
    objectUploaderConfig
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
