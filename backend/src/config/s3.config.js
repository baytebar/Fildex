import AWS from 'aws-sdk';

// Configure AWS SDK for Hetzner Cloud Storage
const s3 = new AWS.S3({
  accessKeyId: process.env.HETZNER_ACCESS_KEY,
  secretAccessKey: process.env.HETZNER_SECRET_KEY,
  endpoint: process.env.HETZNER_ENDPOINT,
  s3ForcePathStyle: true, // Needed for Hetzner
  signatureVersion: 'v4',
  region: 'hel1', // Hetzner region
});

export default s3;