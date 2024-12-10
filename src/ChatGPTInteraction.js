import React, { useState } from 'react';
import './ChatGPTInteraction.css'; // Asegúrate de crear y enlazar este archivo

function ChatGPTInteraction() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return; // No enviar mensajes vacíos

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Agrega el token si es necesario
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (response.ok) {
        setReply(data.reply); // Muestra la respuesta en el chat
        setMessage(''); // Limpia el campo de texto
      } else {
        setReply(data.error || 'Hubo un error al procesar tu solicitud.');
      }
    } catch (error) {
      console.error('Error al comunicarse con el servidor:', error);
      setReply('Hubo un error al comunicarse con el servidor.');
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">🤖 Chat con IA</h2>
      <div className="chat-box">
        <input
          type="text"
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe tu pregunta aquí..."
        />
        <button className="chat-button" onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
      <div className="chat-response">
        <strong>Respuesta:</strong>
        <p>{reply}</p>
      </div>
    </div>
  );
}

export default ChatGPTInteraction;
