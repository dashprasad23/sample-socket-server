, r// server.js

const http = require('http');
const { emit } = require('process');
const { Server } = require('socket.io');

// Create an HTTP server
const server = http.createServer();

// Initialize Socket.IO and attach it to the HTTP server
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // Change this to your client's URL for production
      methods: ['GET', 'POST'], // Allowed HTTP methods
      allowedHeaders: ['my-custom-header'], // Allowed headers
      credentials: true // Allow credentials (cookies, Authorization headers, etc.)
    }
  });

// Event handler when a client connects
io.on('connection', (socket) => {
  console.log('A user connected');

  // Example: Handle 'chat message' event
  socket.on('joint-room', (msg) => {
    console.log(msg, 'Join room')
    if(msg.roomId) {
        socket.join(msg.roomId);
        if(msg.userType === 'agent') {
          io.to(msg.roomId).emit('agent-join', {message: "Agent join room ", roomId: msg.roomId})
        }
    }
    
  });

  socket.on('call-user', (msg) => {
    console.log("call user")
    io.to(msg.roomId).emit('incoming-call', {offer: msg.offer})
  });

  socket.on('call-accepted', (msg) => {
    console.log("call accepted 2")
    io.to(msg.roomId).emit('call-accepted', {answer: msg.answer})
  });

  

  // Example: Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server on port 3000
const PORT = process.env.PORT ||  8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
