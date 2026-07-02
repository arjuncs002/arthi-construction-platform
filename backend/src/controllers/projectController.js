const prisma = require('../config/db');

// Get all projects (Explore list/Advertisements)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

// Get single project details
exports.getProjectById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        constructionUpdates: {
          orderBy: { date: 'asc' }
        },
        gallery: {
          orderBy: { date: 'desc' }
        },
        documents: {
          orderBy: { date: 'desc' }
        },
        supervisor: {
          include: {
            user: {
              select: { name: true, phone: true, email: true, avatar: true }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

// Get assigned projects for supervisor
exports.getAssignedProjects = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Access denied. Supervisors only.' });
    }

    const supervisor = await prisma.supervisor.findUnique({
      where: { userId: req.user.id }
    });

    if (!supervisor) {
      return res.status(404).json({ error: true, message: 'Supervisor profile not found' });
    }

    const projects = await prisma.project.findMany({
      where: { supervisorId: supervisor.id },
      include: {
        clients: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true, avatar: true }
            }
          }
        }
      }
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching assigned projects:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

// Update project progress/completion (Supervisor action)
exports.updateProjectProgress = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Access denied. Supervisors only.' });
    }

    const id = parseInt(req.params.id);
    const { constructionProgress, status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    // Verify supervisor owns this project
    const supervisor = await prisma.supervisor.findUnique({ where: { userId: req.user.id } });
    if (project.supervisorId !== supervisor.id) {
      return res.status(403).json({ error: true, message: 'Access denied. You do not manage this project.' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        constructionProgress: constructionProgress !== undefined ? parseInt(constructionProgress) : project.constructionProgress,
        status: status || project.status
      }
    });

    // Notify clients connected to this project
    const clients = await prisma.client.findMany({
      where: { projectId: id },
      select: { userId: true }
    });

    for (const c of clients) {
      await prisma.notification.create({
        data: {
          userId: c.userId,
          title: 'Construction Progress Updated',
          body: `The construction progress for "${project.name}" has been updated to ${updatedProject.constructionProgress}%.`
        }
      });
    }

    // Emit live update event if io is bound in the controller
    if (req.io) {
      req.io.to(`project_${id}`).emit('progress:update', {
        projectId: id,
        constructionProgress: updatedProject.constructionProgress,
        status: updatedProject.status
      });
    }

    res.status(200).json({
      message: 'Project progress updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating project progress:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

const { generateAndSaveQRCode } = require('../utils/qrGenerator');

exports.getClientQRCode = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const clientId = parseInt(req.params.clientId);

    if (isNaN(projectId) || isNaN(clientId)) {
      return res.status(400).json({ error: true, message: 'Invalid parameters' });
    }

    const qrRecord = await generateAndSaveQRCode(clientId, projectId);
    res.status(200).json(qrRecord);
  } catch (error) {
    console.error('Error fetching/generating client QR code:', error);
    res.status(500).json({ error: true, message: 'Failed to generate QR Code' });
  }
};
