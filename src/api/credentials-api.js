import { createClient, deleteClient } from '@/services/s3-client-service';

export const isCredentialsValid = credentials => {
  const s3 = createClient({
    apiVersion: '2006-03-01',
    endpoint: credentials.endpoint,
    accessKeyId: credentials.accessKey,
    secretAccessKey: credentials.secretKey
  });
  return new Promise((resolve, reject) => {
    if (!s3) return reject(false);
    s3.headBucket({ Bucket: credentials.bucket }, err => {
      if (err) {
        console.log(err);
        deleteClient();
        return reject(false);
      }
      return resolve(true);
    });
  });
};
