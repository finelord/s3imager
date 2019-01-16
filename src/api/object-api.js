import { getClient } from '@/services/s3-client-service';
import store from '@/store';

const META_EXT = 'meta';
const EXT_DELIMITER = '.';
const ITEMS_SORT_ORDER_META = `sort-order${EXT_DELIMITER}${META_EXT}`;
const GROUPS_SORT_ORDER_META = `groups-sort-order${EXT_DELIMITER}${META_EXT}`;

// FETCH

export async function fetchObjectList(bucketName) {
  const objectList = await fetchFullObjectList(bucketName);
  return objectList.filter(bucket => bucket.name.split(EXT_DELIMITER).pop() !== META_EXT);
}

export function fetchFullObjectList(prefix) {
  return new Promise((resolve, reject) => {
    const bucket = store.state.context.bucket;
    getClient().listObjectsV2({ Bucket: bucket, Prefix: `${prefix}/` }, (err, data) => {
      if (err) return reject(err);
      const objectList = data.Contents.map(obj => ({ ...obj, name: obj.Key.split('/')[1] }));
      return resolve(objectList);
    });
  });
}

export const fetchGroupListSortOrder = bucketName => {
  return fetchJsonObject(bucketName, GROUPS_SORT_ORDER_META);
};

export const fetchObjectListSortOrder = bucketName => {
  return fetchJsonObject(bucketName, ITEMS_SORT_ORDER_META);
};

export const fetchJsonObject = (bucketName, objectName) => {
  return fetchObject(bucketName, objectName).then(object => {
    const decoder = new TextDecoder('utf-8');
    const string = decoder.decode(object);
    const parsedObject = JSON.parse(string); // TODO: wrap this into try/catch
    return parsedObject;
  });
};

// TODO: use Key instead?
export const fetchObject = (prefix, objectName) => {
  const bucket = store.state.context.bucket;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: `${prefix}/${objectName}`
    };
    getClient().getObject(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.Body);
    });
  });
};

// UPLOAD

export const uploadGroupListSortOrder = (bucketName, meta) => {
  return uploadStringObject(bucketName, GROUPS_SORT_ORDER_META, JSON.stringify(meta));
};

export const uploadObjectListSortOrder = (bucketName, meta) => {
  return uploadStringObject(bucketName, ITEMS_SORT_ORDER_META, JSON.stringify(meta));
};

export const uploadArrayBufferObject = (bucketName, objectName, arrayBuffer) => {
  const object = Buffer.from(new Uint8Array(arrayBuffer));
  return uploadObject(bucketName, objectName, object);
};

export const uploadStringObject = (bucketName, objectName, StringObject) => {
  return uploadObject(bucketName, objectName, StringObject);
};

const uploadObject = (prefix, objectName, object) => {
  const bucket = store.state.context.bucket;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: `${prefix}/${objectName}`,
      Body: object,
      ACL: 'public-read'
    };
    getClient().putObject(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data.ETag);
    });
  });
};

export const deleteObject = (prefix, objectName) => {
  const bucket = store.state.context.bucket;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: `${prefix}/${objectName}`
    };
    getClient().deleteObject(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

export const deleteObjectList = (prefix, objectList) => {
  const bucket = store.state.context.bucket;
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Delete: {
        Objects: objectList.map(name => ({ Key: `${prefix}/${name}` })),
        Quiet: false
      }
    };
    getClient().deleteObjects(params, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
