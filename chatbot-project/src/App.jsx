// App.jsx
import { useState, useEffect } from "react";
import { Chatbot } from "supersimpledev";
import { ChatInput } from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import "./App.css";

function App() {
  const [chatMessages, setChatMessages] = useState(
    JSON.parse(localStorage.getItem("chatMessages")) || []
  );

  useEffect(() => {
    Chatbot.addResponses({
      // --- Greetings & Small Talk ---
      hello: "Hello! How can I help you today?",
      hi: "Hi! Nice to meet you.",
      "how are you":
        "I'm just a program, but I'm feeling great! How about you?",
      "what is your name": "I'm a chatbot. You can call me Chatbot.",

      // --- Functionality & Help ---
      help: "You can try asking me 'what can you do' or 'tell me a joke'.",
      "what can you do":
        "I can chat with you and answer some preset questions.",
      "what time is it":
        "I can't tell you the exact time, but it's definitely a great time to code!",

      // --- Fun Interactions ---
      "tell me a joke":
        "Why do programmers prefer dark mode? Because light attracts bugs!",
      "are you a robot": "Yes, I am! Beep boop.",
      "who created you": "A great developer who is learning React created me.",

      // --- Farewells ---
      bye: "Bye! Have a great day!",
      goodbye: "Talk to you next time!",
    });
  }, []);

  return (
    <div className="app-container">
      {chatMessages.length === 0 && (
        <p className="welcome-message">
          Welcome to the chatbot project! Send a message using the textbot
          below.
        </p>
      )}
      <ChatMessages chatMessages={chatMessages} />
      <ChatInput
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </div>
  );
}

export default App;
