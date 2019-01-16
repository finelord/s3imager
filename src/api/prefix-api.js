import { getClient } from '@/services/s3-client-service';
import store from '@/store';
import {
  fetchFullObjectList,
  fetchObject,
  uploadStringObject,
  deleteObjectList
} from './object-api';

const META_PREFIX = 'meta';
const PREFIX_LIST_META_OBJECT = 'prefix-list.meta';
const OBJECT_UPLOADER_CONFIG_META_NAME = 'object-uploader-config.meta';

export function fetchPrefixList() {
  return fetchFullPrefixList().then(list => list.filter(prefix => prefix !== META_PREFIX));
}

export function fetchFullPrefixList() {
  return new Promise((resolve, reject) => {
    const bucket = store.state.context.bucket;
    getClient().listObjectsV2({ Bucket: bucket, Delimiter: '/' }, (err, data) => {
      if (err) return reject(err);
      const prefixList = data.CommonPrefixes.map(item => item.Prefix.split('/')[0]);
      return resolve(prefixList);
    });
  });
}

export function createPrefix(prefix) {
  if (!prefix) return Promise.reject(); // TODO: add reject error message
  return uploadStringObject(prefix, 'prefix.meta', `created: ${Date.now()}`);
}

export function fetchPrefixListMeta() {
  return fetchMeta(PREFIX_LIST_META_OBJECT);
}

export function uploadPrefixListMeta(meta) {
  return uploadStringObject(META_PREFIX, PREFIX_LIST_META_OBJECT, JSON.stringify(meta));
}

export function fetchObjectUploaderConfigMeta() {
  return fetchMeta(OBJECT_UPLOADER_CONFIG_META_NAME);
}

export function fetchMeta(metaObjectName) {
  return fetchObject(META_PREFIX, metaObjectName).then(object => {
    const decoder = new TextDecoder('utf-8');
    const string = decoder.decode(object);
    const parsedObject = JSON.parse(string); // TODO: wrap this into try/catch
    return parsedObject;
  });
}

export function uploadObjectUploaderConfigMeta(meta) {
  return uploadStringObject(META_PREFIX, OBJECT_UPLOADER_CONFIG_META_NAME, JSON.stringify(meta));
}

export async function deletePrefix(prefix) {
  const objectList = await fetchFullObjectList(prefix);
  if (objectList.length) {
    const objectNameList = objectList.map(obj => obj.name);
    await deleteObjectList(prefix, objectNameList);
  }
}
