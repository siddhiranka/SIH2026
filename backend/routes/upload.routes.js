const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../middleware/upload.middleware');

/**
 * POST /api/upload
 * Upload a single file to Cloudinary.
 * Returns: { url, publicId, resourceType, mimeType, originalName }
 */
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided. Please attach a file with field name "file".' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    res.json({
      url: result.url,
      publicId: result.publicId,
      resourceType: result.resourceType,
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('[Upload] Cloudinary upload error:', error.message);
    res.status(500).json({ message: 'File upload failed: ' + error.message });
  }
});

// Handle multer errors (file size, file type)
router.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large. Maximum allowed size is 50MB.' });
  }
  if (err && err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
