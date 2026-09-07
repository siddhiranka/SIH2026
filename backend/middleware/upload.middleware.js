const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage so we can stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, videos, documents
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: images, PDF, video, Word, PowerPoint, text.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

/**
 * Upload a file buffer to Cloudinary and return the result.
 * @param {Buffer} buffer - The file buffer from multer
 * @param {string} mimetype - The file's MIME type
 * @param {string} [folder] - Optional Cloudinary folder (default: 'learnmate')
 * @returns {Promise<{ url: string, publicId: string, resourceType: string }>}
 */
const uploadToCloudinary = (buffer, mimetype, folder = 'learnmate') => {
  return new Promise((resolve, reject) => {
    let resourceType = 'auto';
    if (mimetype.startsWith('image/')) resourceType = 'image';
    else if (mimetype.startsWith('video/')) resourceType = 'video';
    else resourceType = 'raw'; // PDFs, docs, etc.

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType
        });
      }
    );

    stream.end(buffer);
  });
};

module.exports = { upload, uploadToCloudinary, cloudinary };
