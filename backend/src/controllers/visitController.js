const prisma = require('../config/db');

exports.getVisits = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    let visits;
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      visits = await prisma.siteVisit.findMany({
        where: { projectId, clientId: client.id },
        orderBy: { date: 'asc' }
      });
    } else {
      visits = await prisma.siteVisit.findMany({
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
        orderBy: { date: 'asc' }
      });
    }

    res.status(200).json(visits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.createVisit = async (req, res) => {
  try {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({ error: true, message: 'Only clients can request visits' });
    }

    const projectId = parseInt(req.params.projectId);
    const { date, time, visitors, notes } = req.body;

    if (isNaN(projectId) || !date || !time) {
      return res.status(400).json({ error: true, message: 'Missing date or time' });
    }

    const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
    if (!client) {
      return res.status(404).json({ error: true, message: 'Client profile not found' });
    }

    const visit = await prisma.siteVisit.create({
      data: {
        projectId,
        clientId: client.id,
        date: new Date(date),
        time,
        visitors: visitors || '1 person',
        notes: notes || '',
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
            title: 'New Site Visit Requested',
            body: `Client requested site visit on ${new Date(date).toLocaleDateString()} at ${time}.`
          }
        });
      }
    }

    res.status(201).json({
      message: 'Site visit requested successfully',
      visit
    });
  } catch (error) {
    console.error('Error requesting visit:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.updateVisitStatus = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can review site visits' });
    }

    const visitId = parseInt(req.params.visitId);
    const { status } = req.body; // CONFIRMED, CANCELLED

    if (isNaN(visitId) || !status) {
      return res.status(400).json({ error: true, message: 'Missing status' });
    }

    const visit = await prisma.siteVisit.findUnique({
      where: { id: visitId },
      include: { client: true }
    });

    if (!visit) {
      return res.status(404).json({ error: true, message: 'Site visit not found' });
    }

    const updatedVisit = await prisma.siteVisit.update({
      where: { id: visitId },
      data: { status }
    });

    // Notify client
    await prisma.notification.create({
      data: {
        userId: visit.client.userId,
        title: `Site Visit: ${status}`,
        body: `Your site visit scheduled for ${new Date(visit.date).toLocaleDateString()} has been ${status}.`
      }
    });

    res.status(200).json({
      message: 'Site visit status updated successfully',
      visit: updatedVisit
    });
  } catch (error) {
    console.error('Error updating visit:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
