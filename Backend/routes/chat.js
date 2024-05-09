const express = require('express');
const router = express.Router();
const { Chat } = require('../model/Models');
const app = express();

// Get all messages
router.get('/chats', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: 1 });
        res.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Post a new message
router.post('/chats/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { text, user } = req.body;
        if (!text || !user) {
            return res.status(400).json({ error: 'Invalid message format' });
        }

        const newMessage = new Chat({
            text: text,
            user: {
                username: user,
                userId: userId,
            },
        });
        
        await newMessage.save();

        // Access the io object from the request object
        const socketIO = require('socket.io');
        const http = require('http');
        const server = http.createServer(app);
        const io = socketIO(server);

        io.emit('newMessage', newMessage);

        res.json(newMessage);
    } catch (error) {
        console.error('Error posting a message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
