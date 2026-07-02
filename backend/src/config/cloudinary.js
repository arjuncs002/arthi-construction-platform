const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name';

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folder = 'arthi_constructions';
      let resource_type = 'auto';

      if (file.mimetype.startsWith('video/')) {
        folder = 'arthi_constructions/videos';
      } else if (file.mimetype.startsWith('image/')) {
        folder = 'arthi_constructions/images';
      } else {
        folder = 'arthi_constructions/documents';
        resource_type = 'raw';
      }

      return {
        folder: folder,
        resource_type: resource_type,
        public_id: file.fieldname + '-' + Date.now()
      };
    }
  });
  console.log('☁️  Cloudinary storage initialized successfully.');
} else {
  console.log('📁 Cloudinary not configured. Falling back to local disk storage.');
  // Ensure local uploads directory exists
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const parser = multer({ storage: storage });

module.exports = {
  cloudinary,
  parser,
  isCloudinaryConfigured
};
