const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'arthiconstructions_secret_key_2026_jensonsolutions';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: true, message: 'Please enter both username/email and password' });
    }

    // Try finding the user by email or by name (case-insensitive for username/demo check)
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: username.trim() } },
          { name: { equals: username.trim() } }
        ]
      },
      include: {
        clientProfile: true,
        supervisorProfile: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: true, message: 'Invalid username or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: true, message: 'Invalid username or password' });
    }

    // Create JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '30d'
    });

    // Determine additional info based on role
    let projectId = null;
    let clientCode = null;
    let assignedProjects = [];

    if (user.role === 'CLIENT' && user.clientProfile) {
      projectId = user.clientProfile.projectId;
      clientCode = user.clientProfile.clientCode;
    } else if (user.role === 'SUPERVISOR' && user.supervisorProfile) {
      const projects = await prisma.project.findMany({
        where: { supervisorId: user.supervisorProfile.id },
        select: { id: true }
      });
      assignedProjects = projects.map(p => p.id);
    }

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar || user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
        projectId,
        clientCode,
        assignedProjects
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        clientProfile: {
          include: {
            project: true
          }
        },
        supervisorProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    let projectId = null;
    let clientCode = null;
    let project = null;

    if (user.role === 'CLIENT' && user.clientProfile) {
      projectId = user.clientProfile.projectId;
      clientCode = user.clientProfile.clientCode;
      project = user.clientProfile.project;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar || user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      projectId,
      clientCode,
      project
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
