const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'Root',
  api_key: process.env.CLOUDINARY_API_KEY || '462589934718866',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'm-jxjzdp37YzRNnshmDkejjA5Gg'
});

let upload;

try {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'learnmate_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'mp3', 'wav', 'webm']
    }
  });
  upload = multer({ storage: storage });
} catch (err) {
  console.warn('[Cloudinary Setup Warning, using disk fallback]:', err.message);
  const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  upload = multer({ storage: diskStorage });
}

module.exports = { cloudinary, upload };
