const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const socketHandler = require('./socket/socketHandler');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust origins in production
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

// Bind socket connection handler
socketHandler(io);

const seedDatabase = require('./utils/seedData');

// Start server
server.listen(PORT, async () => {
  console.log(`=================================================`);
  console.log(`  Arthi Constructions Backend API Service Running`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================`);
  
  // Seed database
  await seedDatabase();
});
