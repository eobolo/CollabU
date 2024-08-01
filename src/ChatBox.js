import React, { useState, useRef } from 'react';
import './styles/ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messageBoxRef = useRef(null);

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
    adjustHeight(e.target);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentMessage.trim()) {
        setMessages([...messages, currentMessage.trim()]);
        setCurrentMessage('');
        resetHeight(e.target);
      }
    }
  };

  const adjustHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const resetHeight = (element) => {
    element.style.height = 'auto';
  };

  return (
    <div className="chat-container">
      <div className="message-box">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
      <textarea
        className="input-field"
        value={currentMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        rows="1"
        placeholder="Type a message..."
        ref={messageBoxRef}
      />
    </div>
  );
};

export default ChatBox;
