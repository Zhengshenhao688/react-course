// ChatInput.jsx
import { useState } from "react";
import { Chatbot } from "supersimpledev";
import LoadingGif from "../assets/loading-spinner.gif";
import "./ChatInput.css";
import dayjs from "dayjs";

/* ChatInput：输入框 + 发送按钮  */
export function ChatInput({ chatMessages, setChatMessages }) {
  // inputText 保存用户当前输入框的文字
  const [inputText, setInputText] = useState("");
  // isLoading 控制是否正在等待机器人回复
  const [isLoading, setIsLoading] = useState(false);

  // 每次输入时更新 inputText
  function saveInputText(event) {
    setInputText(event.target.value);
  }

  // 发送消息函数
  async function sendMessage() {
    if (isLoading || inputText.trim() === "") {
      return;
    }

    setIsLoading(true);
    setInputText("");

    const currentTime = dayjs().format("h:mma");

    // 1️⃣ 用户消息添加进聊天列表
    const newChatMessages = [
      ...chatMessages,
      {
        message: inputText,
        sender: "user",
        id: crypto.randomUUID(),
        time: currentTime,
      },
    ];

    // 2️⃣ 显示一个“机器人正在回复”的加载动画
    setChatMessages([
      ...newChatMessages,
      {
        message: <img src={LoadingGif} className="loading-spinner" />,
        sender: "robot",
        id: crypto.randomUUID(),
        time: currentTime,
      },
    ]);

    // 3️⃣ 调用 Chatbot 库获得机器人回复
    const response = await Chatbot.getResponseAsync(inputText.toLocaleLowerCase());

    // 4️⃣ 替换加载动画为机器人真实回复
    setChatMessages([
      ...newChatMessages,
      {
        message: response,
        sender: "robot",
        id: crypto.randomUUID(),
        time: currentTime,
      },
    ]);
    // 5️⃣ 回复完毕，关闭加载状态
    setIsLoading(false);
  }

  // 键盘事件监听
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
    if (event.key === "Escape") {
      setInputText("");
    }
  }

  function clearChat() {
    setChatMessages([]);
  }

  // 输入框 + 按钮的结构
  return (
    <div className="chat-input-container">
      <input
        placeholder="Send a message to Chatbot"
        size="30"
        onChange={saveInputText}
        onKeyDown={handleKeyDown}
        value={inputText}
        className="chat-input"
      />
      <button onClick={sendMessage} className="send-button">
        Send
      </button>
      <button onClick={clearChat} className="clear-button">
        Clear
      </button>
    </div>
  );
}
