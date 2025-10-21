import { S3Client } from '@aws-sdk/client-s3';

// Configure AWS SDK v3 for Hetzner Cloud Storage
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.HETZNER_ACCESS_KEY,
    secretAccessKey: process.env.HETZNER_SECRET_KEY,
  },
  endpoint: process.env.HETZNER_ENDPOINT,
  forcePathStyle: true, // Needed for Hetzner
  region: 'hel1', // Hetzner region
});

export default s3Client;