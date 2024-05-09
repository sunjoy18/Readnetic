import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const socket = io('http://localhost:5000');

function ChatRoom() {
    const { randomWriter } = useParams();

    const userId = localStorage.getItem('userid');
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesContainerRef = useRef(null);
    const shouldAutoScrollRef = useRef(true);

    useEffect(() => {
        // Fetch existing messages from the backend when the component mounts
        fetchMessages();

        // Listen for new messages from the server
        socket.on('newMessage', (message) => {
            setMessages([...messages, message]);

            // Auto-scroll only if the user hasn't manually scrolled up
            if (shouldAutoScrollRef.current) {
                scrollToBottom();
            }
        });

        // Scroll to the bottom when messages change
        scrollToBottom();

        return () => {
            // Disconnect the socket when the component unmounts
            socket.disconnect();
        };
    }, [messages]);

    useEffect(() => {
        if (shouldAutoScrollRef.current) {
            scrollToBottom();
        }
    }, [messages.length]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/chats');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        // Send the new message to the backend
        axios.post(`http://localhost:5000/api/chats/${userId}`, {
            text: newMessage,
            user: randomWriter,
        });

        setNewMessage('');
    };

    const handleScroll = () => {
        const messagesContainer = messagesContainerRef.current;
        shouldAutoScrollRef.current =
            messagesContainer.scrollTop + messagesContainer.clientHeight === messagesContainer.scrollHeight;
    };

    const scrollToBottom = () => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    };

    return (
        <div className='community-body'>
            <h2>Community Chatroom</h2>
            <div
                className='message-body'
                ref={messagesContainerRef}
                style={{ border: '1px solid #ccc', overflow: 'auto' }}
                onScroll={handleScroll}
            >
                {messages.map((msg) => (
                    <div key={msg._id} className={msg.user.userId === userId ? 'bubble right' : 'bubble left'}>
                        <strong>{msg.user.username}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-body">
                <input
                    className='input-tag'
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="send-btn" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatRoom;
