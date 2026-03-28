import React, { useState } from "react";
import useChat from "../../../hooks/useChat";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";
import "./ChatWidget.css";

const ChatWidget: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [input, setInput] = useState("");
  const { response, loading, error, sendMessage } = useChat();
  const [messages, setMessages] = useState<
    { from: "user" | "bot"; text: string }[]
  >([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    try {
      const res = await sendMessage(text);
      const reply = res?.reply || "No reply";
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch (e) {
      // error surfaced via hook
    }
  };

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.from}`}>
            {m.text}
          </div>
        ))}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {response &&
          !loading &&
          !messages.find(
            (m) => m.from === "bot" && m.text === (response as any).reply,
          ) && <div className="chat-msg bot">{(response as any).reply}</div>}
      </div>
      <div className="chat-footer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
