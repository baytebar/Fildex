# Hetzner Object Storage Troubleshooting Guide

## Issue: "Resolved credential object is not valid"

This error indicates that the Hetzner credentials are either incorrect or malformed.

## Common Causes and Solutions

### 1. Incorrect Credentials Format
**Problem**: Access keys or secret keys are malformed
**Solution**: 
- Verify credentials in Hetzner Cloud Console
- Ensure no extra spaces or characters
- Check if credentials are properly copied

### 2. Wrong Endpoint URL
**Problem**: Endpoint URL is incorrect
**Solution**: 
- Hetzner endpoint should be: `https://your-bucket-name.your-region.your-provider.com`
- Example: `https://my-bucket.hel1.cdn.your-objectstorage.com`

### 3. Bucket Permissions
**Problem**: Access key doesn't have proper permissions
**Solution**:
- Check bucket permissions in Hetzner Cloud Console
- Ensure access key has read/write permissions
- Verify bucket exists and is accessible

### 4. Region Mismatch
**Problem**: Region in code doesn't match bucket region
**Solution**:
- Verify bucket region in Hetzner Cloud Console
- Update region in s3.config.js if needed

## Debug Steps

1. **Check Environment Variables**:
   ```bash
   node debug-resume-upload.js
   ```

2. **Verify Credentials**:
   - Login to Hetzner Cloud Console
   - Go to Object Storage
   - Check bucket name and endpoint
   - Verify access keys

3. **Test Connection**:
   - Use Hetzner Cloud Console to upload a test file
   - Verify bucket is accessible

## Configuration Examples

### Correct Configuration
```javascript
const s3Client = new S3Client({
  credentials: {
    accessKeyId: 'your-access-key',
    secretAccessKey: 'your-secret-key',
  },
  endpoint: 'https://your-bucket.hel1.cdn.your-objectstorage.com',
  forcePathStyle: true,
  region: 'hel1',
});
```

### Environment Variables
```env
HETZNER_BUCKET=your-bucket-name
HETZNER_ENDPOINT=https://your-bucket.hel1.cdn.your-objectstorage.com
HETZNER_ACCESS_KEY=your-access-key
HETZNER_SECRET_KEY=your-secret-key
```

## Fallback Solution

If Hetzner continues to fail, the application will automatically fall back to local storage:
- Files are saved to `backend/src/public/uploads/`
- URLs are served via static file serving
- All functionality remains intact

## Testing the Fix

1. Start the server: `npm run dev`
2. Upload a resume through the frontend
3. Check server logs for debug information
4. Verify file is saved (either in Hetzner or locally)

## Next Steps

1. Verify Hetzner credentials are correct
2. Test with a simple file upload
3. Check Hetzner Cloud Console for any errors
4. Contact Hetzner support if credentials are correct but uploads fail
