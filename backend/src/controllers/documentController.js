const prisma = require('../config/db');

exports.getDocuments = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    const documents = await prisma.document.findMany({
      where: { projectId },
      orderBy: { date: 'desc' }
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can upload documents' });
    }

    const projectId = parseInt(req.params.projectId);
    const { name, type } = req.body;

    if (isNaN(projectId) || !name || !type) {
      return res.status(400).json({ error: true, message: 'Missing name or document type' });
    }

    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No file uploaded' });
    }

    // Determine URL path
    let fileUrl = req.file.path; // Cloudinary URL if configured
    if (!req.file.path.startsWith('http')) {
      // Local path fallback, translate to relative URL path
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const document = await prisma.document.create({
      data: {
        projectId,
        name,
        type, // Agreement, Blueprint, Bill, Receipt, etc.
        url: fileUrl,
        uploadedBy: 'Supervisor',
        date: new Date()
      }
    });

    // Notify connected clients
    const clients = await prisma.client.findMany({
      where: { projectId },
      select: { userId: true }
    });

    for (const c of clients) {
      await prisma.notification.create({
        data: {
          userId: c.userId,
          title: `New Document Uploaded`,
          body: `Supervisor uploaded a new document: "${name}" (${type}).`
        }
      });
    }

    // Emit live update
    if (req.io) {
      req.io.to(`project_${projectId}`).emit('document:new', {
        projectId,
        document
      });
    }

    res.status(201).json({
      message: 'Document uploaded successfully',
      document
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can delete documents' });
    }

    const documentId = parseInt(req.params.documentId);
    if (isNaN(documentId)) {
      return res.status(400).json({ error: true, message: 'Invalid Document ID' });
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { project: true }
    });

    if (!document) {
      return res.status(404).json({ error: true, message: 'Document not found' });
    }

    // Verify supervisor owns this project
    const supervisor = await prisma.supervisor.findUnique({ where: { userId: req.user.id } });
    if (document.project.supervisorId !== supervisor.id) {
      return res.status(403).json({ error: true, message: 'Access denied. You do not manage this project.' });
    }

    await prisma.document.delete({ where: { id: documentId } });

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
