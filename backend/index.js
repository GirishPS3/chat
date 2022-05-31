const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = {};
app.use(cors());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('joined', ({ user }) => {
    console.log(`${user} Joined`);
    users[socket.id] = user;
    socket.broadcast.emit('sendMessage', { user: 'Admin', message: `${users[socket.id]} has joined` });
    console.log(users);
    io.emit('userList', { users });
    socket.emit('sendMessage', { user: 'Admin', message: ` Welcome to chat, ${users[socket.id]}` })
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    let user = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('sendMessage', { user: 'admin', message: `${user} has left` });
    socket.broadcast.emit('userList', { users });

  });
  socket.on('message', ({ message, id }) => {
    io.emit('sendMessage', { user: users[id], message, id })
  })
});

server.listen(3001, () => {
  console.log('listening on *:3000');
});