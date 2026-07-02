const prisma = require('../config/db');

exports.getRequests = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    let requests;
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      requests = await prisma.request.findMany({
        where: { projectId, clientId: client.id },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      requests = await prisma.request.findMany({
        where: { projectId },
        include: {
          client: {
            include: {
              user: {
                select: { name: true, phone: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ error: true, message: 'Only clients can raise requests' });
    }

    const projectId = parseInt(req.params.projectId);
    const { category, title, description } = req.body;

    if (isNaN(projectId) || !category || !title) {
      return res.status(400).json({ error: true, message: 'Missing required parameters' });
    }

    const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
    if (!client) {
      return res.status(404).json({ error: true, message: 'Client profile not found' });
    }

    const request = await prisma.request.create({
      data: {
        projectId,
        clientId: client.id,
        category,
        title,
        description,
        status: 'PENDING'
      }
    });

    // Notify supervisor
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project && project.supervisorId) {
      const supervisor = await prisma.supervisor.findUnique({
        where: { id: project.supervisorId }
      });
      if (supervisor) {
        await prisma.notification.create({
          data: {
            userId: supervisor.userId,
            title: 'New Client Request Raised',
            body: `Client raised a request for "${title}" in category "${category}".`
          }
        });
      }
    }

    res.status(201).json({
      message: 'Request raised successfully',
      request
    });
  } catch (error) {
    console.error('Error raising request:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can review requests' });
    }

    const requestId = parseInt(req.params.requestId);
    const { status, reply } = req.body;

    if (isNaN(requestId) || !status) {
      return res.status(400).json({ error: true, message: 'Missing status' });
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        client: true
      }
    });

    if (!request) {
      return res.status(404).json({ error: true, message: 'Request not found' });
    }

    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        status, // APPROVED, REJECTED, COMPLETED
        reply: reply || request.reply
      }
    });

    // Notify client
    await prisma.notification.create({
      data: {
        userId: request.client.userId,
        title: `Request Status Updated: ${status}`,
        body: `Your request "${request.title}" is now marked as ${status}.`
      }
    });

    res.status(200).json({
      message: 'Request status updated successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error reviewing request:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
