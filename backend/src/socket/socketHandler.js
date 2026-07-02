module.exports = (io) => {
  // Store connected user socket associations
  const activeConnections = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room when user identifies
    socket.on('join_project', ({ projectId, userId, role }) => {
      if (projectId) {
        const roomName = `project_${projectId}`;
        socket.join(roomName);
        console.log(`👤 User ${userId} (${role}) joined room: ${roomName}`);
        
        if (userId) {
          activeConnections.set(userId, socket.id);
        }
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ projectId, userName, isTyping }) => {
      socket.to(`project_${projectId}`).emit('typing:status', { userName, isTyping });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      // Remove connection association
      for (const [userId, socketId] of activeConnections.entries()) {
        if (socketId === socket.id) {
          activeConnections.delete(userId);
          break;
        }
      }
    });
  });

  // Attach io object to app instance for controllers
  return activeConnections;
};
