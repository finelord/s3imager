import Vue from 'vue';
import Router from 'vue-router';
import store from './store';

import { getClient } from './services/s3-client-service';
import { getCredentials, resetCredentials } from './services/storage-service';
import { isCredentialsValid } from './api/credentials-api';

import Login from './components/Login';
import ObjectStorageManager from './components/ObjectStorageManager';
import GroupList from './components/GroupList';
import ObjectList from './components/ObjectList';
import ObjectUploader from './components/ObjectUploader';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'app',
      component: ObjectStorageManager,
      beforeEnter: async (_to, _from, next) => {
        const s3 = getClient();
        if (s3) return next();

        const credentials = getCredentials();
        if (!credentials) return next({ name: 'login' });

        const isValid = await isCredentialsValid(credentials);
        if (!isValid) return next({ name: 'login' });

        const { endpoint, useSSL, bucket, cloudFrontUrl } = credentials;
        store.dispatch('context/initContext', { endpoint, useSSL, bucket, cloudFrontUrl });
        next({ name: 'groupList' });
      },
      children: [
        {
          path: 'group-list',
          name: 'groupList',
          component: GroupList
        },
        {
          path: 'object-list',
          name: 'objectList',
          component: ObjectList
        },
        {
          path: 'object-uploader',
          name: 'objectUploader',
          component: ObjectUploader
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (_to, _from, next) => {
        resetCredentials();
        next({ name: 'login' });
      }
    },
    {
      path: '*',
      name: 'notFound',
      redirect: { name: 'app' }
    }
  ]
});
