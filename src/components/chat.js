"use client"
import { useEffect, useState, useRef } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Kết nối tới WebSocket server
        socket.current = new WebSocket('ws://localhost:8000/ws/diagnosis/');

        socket.current.onmessage = function(event) {
            const data = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, { message: data.message || data.error, isUser: false }]);
        };

        socket.current.onclose = function(event) {
            console.log('WebSocket closed', event);
        };

        socket.current.onerror = function(error) {
            console.error('WebSocket error', error);
        };

        return () => {
            socket.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() !== '') {
            const message = { message: input };
            socket.current.send(JSON.stringify(message));
            setMessages(prevMessages => [...prevMessages, { message: input, isUser: true }]);
            setInput('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 p-4 rounded-lg ${msg.isUser ? 'bg-blue-100 self-end' : 'bg-white self-start'}`}>
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-300 flex">
                <input 
                    type="text" 
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Enter your message..."
                />
                <button 
                    className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
