const prisma = require('../config/db');

exports.getUpdatesByProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    const updates = await prisma.constructionUpdate.findMany({
      where: { projectId },
      orderBy: { date: 'asc' }
    });

    res.status(200).json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.createUpdate = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Access denied. Supervisors only.' });
    }

    const projectId = parseInt(req.params.projectId);
    const { stage, percentage, note } = req.body;

    if (isNaN(projectId) || !stage || percentage === undefined) {
      return res.status(400).json({ error: true, message: 'Missing required fields' });
    }

    // Check project exists and supervisor manages it
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    const supervisor = await prisma.supervisor.findUnique({ where: { userId: req.user.id } });
    if (project.supervisorId !== supervisor.id) {
      return res.status(403).json({ error: true, message: 'Access denied. You do not manage this project.' });
    }

    // Upsert or create construction update stage
    const update = await prisma.constructionUpdate.create({
      data: {
        projectId,
        stage,
        percentage: parseInt(percentage),
        note
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
          title: 'Timeline Update',
          body: `New update added to "${stage}": ${percentage}% done.`
        }
      });
    }

    if (req.io) {
      req.io.to(`project_${projectId}`).emit('timeline:update', {
        projectId,
        update
      });
    }

    res.status(201).json({
      message: 'Construction update created successfully',
      update
    });
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Access denied. Supervisors only.' });
    }

    const updateId = parseInt(req.params.updateId);
    if (isNaN(updateId)) {
      return res.status(400).json({ error: true, message: 'Invalid Update ID' });
    }

    const update = await prisma.constructionUpdate.findUnique({
      where: { id: updateId },
      include: { project: true }
    });

    if (!update) {
      return res.status(404).json({ error: true, message: 'Update not found' });
    }

    const supervisor = await prisma.supervisor.findUnique({ where: { userId: req.user.id } });
    if (update.project.supervisorId !== supervisor.id) {
      return res.status(403).json({ error: true, message: 'Access denied. You do not manage this project.' });
    }

    await prisma.constructionUpdate.delete({
      where: { id: updateId }
    });

    res.status(200).json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Error deleting update:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    const gallery = await prisma.galleryItem.findMany({
      where: { projectId },
      orderBy: { date: 'desc' }
    });

    res.status(200).json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.uploadGalleryItem = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can upload progress photos' });
    }

    const projectId = parseInt(req.params.projectId);
    const { caption } = req.body;

    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No file uploaded' });
    }

    let fileUrl = req.file.path;
    if (!req.file.path.startsWith('http')) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

    const galleryItem = await prisma.galleryItem.create({
      data: {
        projectId,
        url: fileUrl,
        caption: caption || '',
        type: fileType,
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
          title: `New Progress Upload`,
          body: `Supervisor uploaded a new ${fileType} to the project gallery.`
        }
      });
    }

    // Emit live update
    if (req.io) {
      req.io.to(`project_${projectId}`).emit('gallery:new', {
        projectId,
        galleryItem
      });
    }

    res.status(201).json({
      message: 'Gallery item uploaded successfully',
      galleryItem
    });
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

// Upload gallery item by URL (no file upload needed — for demo / URL-based uploads)
exports.uploadGalleryByUrl = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can upload progress photos' });
    }

    const projectId = parseInt(req.params.projectId);
    const { url, caption } = req.body;

    if (isNaN(projectId) || !url) {
      return res.status(400).json({ error: true, message: 'Missing project ID or URL' });
    }

    const galleryItem = await prisma.galleryItem.create({
      data: {
        projectId,
        url,
        caption: caption || '',
        type: 'image',
        uploadedBy: 'Supervisor',
        date: new Date()
      }
    });

    // Notify clients
    const clients = await prisma.client.findMany({ where: { projectId }, select: { userId: true } });
    for (const c of clients) {
      await prisma.notification.create({
        data: {
          userId: c.userId,
          title: 'New Construction Photo Uploaded',
          body: `Supervisor uploaded a new photo to the project gallery.`
        }
      });
    }

    if (req.io) {
      req.io.to(`project_${projectId}`).emit('gallery:new', { projectId, galleryItem });
    }

    res.status(201).json({ message: 'Gallery item uploaded successfully', galleryItem });
  } catch (error) {
    console.error('Error uploading gallery by URL:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can delete gallery items' });
    }

    const itemId = parseInt(req.params.itemId);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: true, message: 'Invalid Item ID' });
    }

    const item = await prisma.galleryItem.findUnique({
      where: { id: itemId },
      include: { project: true }
    });

    if (!item) {
      return res.status(404).json({ error: true, message: 'Gallery item not found' });
    }

    const supervisor = await prisma.supervisor.findUnique({ where: { userId: req.user.id } });
    if (item.project.supervisorId !== supervisor.id) {
      return res.status(403).json({ error: true, message: 'Access denied. You do not manage this project.' });
    }

    await prisma.galleryItem.delete({ where: { id: itemId } });

    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
