const prisma = require('../config/db');

exports.getPayments = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: true, message: 'Invalid Project ID' });
    }

    let payments;
    if (req.user.role === 'CLIENT') {
      const client = await prisma.client.findUnique({ where: { userId: req.user.id } });
      payments = await prisma.payment.findMany({
        where: { projectId, clientId: client.id },
        orderBy: { due: 'asc' }
      });
    } else {
      payments = await prisma.payment.findMany({
        where: { projectId },
        include: {
          client: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { due: 'asc' }
      });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.createPayment = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can schedule payments' });
    }

    const projectId = parseInt(req.params.projectId);
    const { clientId, description, amount, due } = req.body;

    if (isNaN(projectId) || !clientId || !description || !amount) {
      return res.status(400).json({ error: true, message: 'Missing required parameters' });
    }

    const payment = await prisma.payment.create({
      data: {
        projectId,
        clientId: parseInt(clientId),
        description,
        amount: parseFloat(amount),
        due: due ? new Date(due) : null,
        status: 'DUE'
      }
    });

    const client = await prisma.client.findUnique({ where: { id: parseInt(clientId) } });
    await prisma.notification.create({
      data: {
        userId: client.userId,
        title: 'New Payment Installment Due',
        body: `An installment of ₹${parseFloat(amount).toLocaleString('en-IN')} for "${description}" has been scheduled.`
      }
    });

    res.status(201).json({
      message: 'Payment milestone created successfully',
      payment
    });
  } catch (error) {
    console.error('Error scheduling payment:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'SUPERVISOR') {
      return res.status(403).json({ error: true, message: 'Only supervisors can record payments' });
    }

    const paymentId = parseInt(req.params.paymentId);
    const { status, method } = req.body; // status: PAID, DUE, UPCOMING

    if (isNaN(paymentId) || !status) {
      return res.status(400).json({ error: true, message: 'Missing payment status' });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { client: true }
    });

    if (!payment) {
      return res.status(404).json({ error: true, message: 'Payment record not found' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        method: method || payment.method,
        date: status === 'PAID' ? new Date() : null
      }
    });

    // Notify client
    if (status === 'PAID') {
      await prisma.notification.create({
        data: {
          userId: payment.client.userId,
          title: 'Payment Confirmed',
          body: `Payment of ₹${payment.amount.toLocaleString('en-IN')} for "${payment.description}" has been confirmed as received.`
        }
      });
    }

    res.status(200).json({
      message: 'Payment status updated successfully',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
