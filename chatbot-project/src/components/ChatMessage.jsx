// ChatMessage.jsx
import RobotProfileImage from "../assets/robot.png";
import UserProfileImage from "../assets/profile-1.jpg";
import "./ChatMessage.css";

/* ChatMessage：单条聊天消息（用户或机器人） */
export function ChatMessage({ message, sender, time }) {
  return (
    <div
      className={sender === "user" ? "chat-message-user" : "chat-message-robot"}
    >
      {sender === "robot" && (
        <img src={RobotProfileImage} className="chat-message-profile" />
      )}
      <div className="chat-message-text">
        {message}
        <div className="chat-message-time">{time}</div>
      </div>
      {sender === "user" && (
        <img src={UserProfileImage} className="chat-message-profile" />
      )}
    </div>
  );
}
