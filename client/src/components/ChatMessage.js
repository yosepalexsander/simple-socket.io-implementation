import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import "./style.css";
let socket;
const ChatMessage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    socket.on("messages", (data) => {
      setMessages(data);
      const chatMessagesElm = document.getElementById("chat-messages");
      chatMessagesElm.scrollTop = chatMessagesElm.scrollHeight;
    });
  };
  useEffect(() => {
    socket = io("http://localhost:5000"); //initialize connection
    loadMessages();
    return () => {
      socket.disconnect(); // when component unmount from DOM
    };
  }, []);

  const messageHandler = (e) => {
    setMessage(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    loadMessages();
  };
  return (
    <div className="container">
      <div className="messages-header">
        <h1>Simple Message</h1>
      </div>
      <div className="messages" id="chat-messages">
        {messages.length > 0 && (
          <div className="messages-body">
            {messages?.map((item, index) => (
              <div key={index} className="messages-item">
                <div>
                  <span className="tail"></span>
                  <p className="message">{item}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={submitHandler}>
        <input
          placeholder="message"
          value={message}
          onChange={messageHandler}
          type="text"
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

export default ChatMessage;
