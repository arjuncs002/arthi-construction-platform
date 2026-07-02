const QRCode = require('qrcode');
const prisma = require('../config/db');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

exports.generateAndSaveQRCode = async (clientId, projectId) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { user: true }
    });

    if (!client) {
      throw new Error('Client profile not found');
    }

    const payload = `CLIENT_VILLA_${client.clientCode}_PORTAL_SECRET`;

    // Check if QR Code record already exists
    let qrRecord = await prisma.qRCode.findUnique({
      where: { clientId }
    });

    if (qrRecord && qrRecord.url) {
      return qrRecord;
    }

    // Generate base64 data URI of QR code
    const qrDataUri = await QRCode.toDataURL(payload, {
      color: {
        dark: '#0f1e3a',  // Arthi navy color
        light: '#ffffff'  // Background
      },
      width: 400
    });

    let qrUrl = null;

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const uploadRes = await cloudinary.uploader.upload(qrDataUri, {
        folder: 'arthi_constructions/qrcodes',
        public_id: `qr-${client.clientCode}`
      });
      qrUrl = uploadRes.secure_url;
    } else {
      // Fallback: save to local filesystem
      const uploadDir = path.join(__dirname, '../../uploads/qrcodes');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `qr-${client.clientCode}-${Date.now()}.png`;
      const filePath = path.join(uploadDir, fileName);
      
      // Convert base64 data to buffer
      const base64Data = qrDataUri.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(filePath, base64Data, 'base64');
      
      qrUrl = `/uploads/qrcodes/${fileName}`;
    }

    if (qrRecord) {
      qrRecord = await prisma.qRCode.update({
        where: { clientId },
        data: { url: qrUrl }
      });
    } else {
      qrRecord = await prisma.qRCode.create({
        data: {
          clientId,
          projectId,
          code: payload,
          url: qrUrl
        }
      });
    }

    return qrRecord;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};
