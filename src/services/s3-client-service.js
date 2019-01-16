import S3 from 'aws-sdk/clients/s3';

let s3;

export function createClient(credentials) {
  try {
    s3 = new S3(credentials);
  } catch (err) {
    return null;
  }
  return s3;
}

export function getClient() {
  return s3;
}

export function deleteClient() {
  s3 = undefined;
}
