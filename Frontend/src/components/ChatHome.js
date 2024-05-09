import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ChatHome() {
    let history = useNavigate()
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Redirect to the chat with the input value
        history(`/chat/${inputValue.trim() !== '' ? inputValue : 'Cooleen Hoover'}`);
    };

    return (
        <div className='chathome'>
            <h1 style={{ fontStyle: 'italic', fontFamily: 'cursive', fontSize: '50px',textAlign:'center' }}>Welcome to Readnetic Community!</h1>
            <p style={{ fontSize: '20px' }}>Explore our chatroom</p>
            <p>To maintain your privacy, please join using your preferred writer's name.</p>
            <input
                type='text'
                style={{ width: '20%', height: '30px', padding: '2px' , textAlign: 'center'}}
                value={inputValue}
                onChange={handleInputChange}
                placeholder='Colleen Hoover'
            />
            <button className='chatbtn' type='submit' onClick={handleSubmit}>
                Join the chat
            </button>
        </div>
    );
}

export default ChatHome;
