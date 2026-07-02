const prisma = require('../config/db');

exports.getChatMessages = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    // Verify user belongs to project or is supervisor
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { clients: true }
    });

    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    const isClient = req.user.role === 'CLIENT' && project.clients.some(c => c.userId === req.user.id);
    const isSupervisor = req.user.role === 'SUPERVISOR' && project.supervisorId !== null;

    if (!isClient && !isSupervisor) {
      return res.status(403).json({ error: true, message: 'Access denied' });
    }

    const messages = await prisma.message.findMany({
      where: { projectId },
      orderBy: { timestamp: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, role: true, avatar: true }
        }
      }
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const { content, type } = req.body;

    if (isNaN(projectId) || !content) {
      return res.status(400).json({ error: true, message: 'Missing required parameters' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        clients: true,
        supervisor: {
          include: { user: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: true, message: 'Project not found' });
    }

    let receiverId = null;

    if (req.user.role === 'CLIENT') {
      // Receiver is the supervisor
      if (!project.supervisor) {
        return res.status(400).json({ error: true, message: 'No supervisor assigned to this project yet.' });
      }
      receiverId = project.supervisor.userId;
    } else if (req.user.role === 'SUPERVISOR') {
      // Receiver is the client (for simplicity, we assume one client per project, or target client from query param)
      const targetClientId = req.query.clientId ? parseInt(req.query.clientId) : null;
      if (targetClientId) {
        const clientObj = await prisma.client.findUnique({ where: { id: targetClientId } });
        receiverId = clientObj.userId;
      } else {
        if (project.clients.length === 0) {
          return res.status(400).json({ error: true, message: 'No client connected to this project.' });
        }
        receiverId = project.clients[0].userId; // default to first client
      }
    }

    if (!receiverId) {
      return res.status(400).json({ error: true, message: 'Could not determine message receiver' });
    }

    const message = await prisma.message.create({
      data: {
        projectId,
        senderId: req.user.id,
        receiverId,
        content,
        type: type || 'text'
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true, avatar: true }
        }
      }
    });

    // Notify receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `New Message from ${req.user.name}`,
        body: content.length > 50 ? `${content.substring(0, 50)}...` : content
      }
    });

    // Emit socket message to project room
    if (req.io) {
      req.io.to(`project_${projectId}`).emit('message:receive', message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
