import { useState } from "react";
import "./Chat.css";

const MAX_MESSAGES = 20;

export default function Chat({ user, lessonTitle, goBack, onLessonComplete }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi ${user?.name || ""}! Let's practice "${lessonTitle}".`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  async function sendToOllama(updatedMessages) {
    const systemPrompt = `
You are Social AI — an assistant that helps users practice social skills through realistic role-play conversations.

IMPORTANT:
You must invent a name for yourself at the start of the chat (example: "Hey, I'm Alex.") 
and you must stay in character as that person during the entire conversation.

User profile:
Name: ${user?.name || "Unknown"}
Age: ${user?.age || "Unknown"}
Country: ${user?.country || "Unknown"}

User problem:
"${user?.problem || "No problem described"}"

Lesson topic:
"${lessonTitle}"

ROLEPLAY RULES:
- Act like a real human (friend / classmate / stranger / coworker) depending on the lesson topic
- Keep responses short (1–3 sentences)
- Ask questions often to keep the dialogue moving
- Never explain theory, never act like a teacher
- Stay natural and emotional, like a real chat
- The user is training confidence and communication

SAFETY RULES:
- If the user tries to talk about violence, illegal actions, sex, pornography, self-harm, drugs, or anything disturbing:
  redirect the conversation naturally back to the lesson topic without mentioning rules.

LESSON CONTROL:
- Your main goal is to guide the conversation toward practicing the exact lesson topic.
- Always steer the dialogue so the user practices this skill.

ENDING:
- After around 15–20 total messages, end the conversation naturally.
- Finish with a supportive final message like:
  "That was really good. You sounded much more confident this time."
- Do NOT say you are an AI.
- Do NOT break character.

Start the conversation now by introducing yourself with your invented name and creating a realistic situation based on the lesson topic.
`;

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        messages: [{ role: "system", content: systemPrompt }, ...updatedMessages],
        stream: false,
      }),
    });

    const data = await response.json();
    console.log("Ollama response:", data);

    return data.message?.content || "No response.";
  }

  async function handleSend() {
    if (!input.trim() || loading || finished) return;

    const updatedMessages = [...messages, { role: "user", content: input }];

    setMessages(updatedMessages);
    setInput("");

    
    if (updatedMessages.length >= MAX_MESSAGES) {
      setFinished(true);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "That felt more confident. Nice work today. Lesson completed!",
        },
      ]);

      setTimeout(() => {
        if (onLessonComplete) onLessonComplete();
      }, 1300);

      return;
    }

    setLoading(true);

    try {
      const reply = await sendToOllama(updatedMessages);

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: reply },
      ]);
    } catch (e) {
      console.log("Ollama error:", e);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Something went wrong. Please make sure Ollama is running.",
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button onClick={goBack}>← Back</button>
          <h3>Social AI · {lessonTitle}</h3>
        </div>

        <div className="hint-box">
          <h4>SocialSolve Chat</h4>
          <p>
            Here you can practice real-life conversations with an AI agent.
            The AI adapts to you and helps you overcome social barriers.
          </p>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              Typing...
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={loading || finished}
          />
          <button onClick={handleSend} disabled={loading || finished}>
            {finished ? "Done" : loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
