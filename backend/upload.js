const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Use memory storage to allow direct upload to S3 or conditional local save
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Configure AWS S3 Client
const s3Config = {};
// Explicit credentials (usually for local development)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}
s3Config.region = process.env.AWS_REGION || 'eu-west-1';

const s3Client = new S3Client(s3Config);

/**
 * Uploads a file buffer to S3 or falls back to local disk storage
 * @param {Express.Multer.File} file 
 * @returns {Promise<string>} Uploaded file URL (S3 public link or local server URL)
 */
async function uploadFile(file) {
  if (!file) return null;

  const fileExtension = path.extname(file.originalname);
  const uniqueFileName = `${uuidv4()}${fileExtension}`;
  const bucketName = process.env.S3_UPLOAD_BUCKET;

  // Fallback if S3 bucket name is not provided
  if (!bucketName) {
    console.warn('AWS S3: S3_UPLOAD_BUCKET is not set. Falling back to local storage.');
    return saveLocally(file, uniqueFileName);
  }

  const params = {
    Bucket: bucketName,
    Key: `enquiries/${uniqueFileName}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Construct public S3 URL
    return `https://${bucketName}.s3.${s3Config.region}.amazonaws.com/enquiries/${uniqueFileName}`;
  } catch (error) {
    console.error('AWS S3: Error uploading file to S3, falling back to local storage. Error:', error.message);
    return saveLocally(file, uniqueFileName);
  }
}

function saveLocally(file, uniqueFileName) {
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const localFilePath = path.join(uploadsDir, uniqueFileName);
  fs.writeFileSync(localFilePath, file.buffer);
  return `/uploads/${uniqueFileName}`;
}

module.exports = {
  upload,
  uploadFile
};
