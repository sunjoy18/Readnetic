const express = require('express');
const db = require('./db');
const cors = require('cors');
const { connectToMongo } = db;
connectToMongo();
const app = express();
const port = 5000;

//msg
const socketIO = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));

// Include the addBook route
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/add'));
app.use('/api', require('./routes/read'));
app.use('/api', require('./routes/addreview'));
app.use('/api', require('./routes/addtocart'));
app.use('/api', require('./routes/cart'));
app.use('/api', require('./routes/chat'));
app.use('/api', require('./routes/orders'));

io.on('connection', (socket) => {
    console.log('A user connected');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
