import { useState } from "react";
import { Mic, Send, X } from "lucide-react";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

export default function FinalPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi, I am your customized avatar" },
    { type: "user", text: "Hi, How can I help you?" },
  ]);

  const createdFromStorage =
    localStorage.getItem("createdAvatarImageUrl") || "";

  const isInteracting = chatOpen || message.trim().length > 0;

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { type: "user", text: message }]);
      setMessage("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "I'm a bot, here to help!" },
        ]);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <section className="pt-32 pb-10 relative">
        <Header1 />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {/* Heading Row */}
            <div className="relative mb-2">
              {/* Left Button */}
              <button
                onClick={() => (window.location.href = "/addCredit")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-red-800 hover:bg-purple-700 text-white text-sm px-2 py-1 rounded-full"
              >
                Add Credit
              </button>

              {/* Center Heading */}
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
                {isInteracting
                  ? "Start a conversation"
                  : "Your Avatar Final Look"}
              </h1>
            </div>

            <p className="text-white mb-8">
              {isInteracting
                ? "Start to interact with your customized avatar"
                : "This is how you look"}
            </p>

            {/* Avatar */}
            <div className="relative mb-8">
              <img
                src={createdFromStorage}
                alt="Final Avatar"
                width={300}
                height={400}
                className="mx-auto rounded-xl"
              />

              <div className="absolute top-[14%] right-0  from-purple-600 via-blue-600 to-purple-600  rounded-lg">
                <div className="bg-[#0f0c29] px-4 py-2 rounded-lg">
                  <span className="text-white">
                    Hi, 👋 I am your customized avatar
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="relative max-w-xl mx-auto">
              <div className="flex items-center bg-black border border-[#1E92FF]/80 rounded-xl px-4 py-2">
                <Mic className="w-4 h-4 text-purple-500 mr-2" />
                <input
                  type="text"
                  placeholder="Type message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-transparent text-white outline-none text-sm placeholder:text-white"
                />
                <button onClick={sendMessage}>
                  <Send className="w-4 h-4 text-purple-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </section>

      {/* Chatbot Widget */}
      <div className="fixed bottom-20 right-5 z-50 flex flex-col items-end">
        {chatOpen && (
          <div className="bg-[#0c0c0c] rounded-2xl  shadow-lg shadow-purple-500/20 mb-3 overflow-hidden">
            <div className="bg-[#1c1c2e] p-3 flex justify-between items-center">
              <span className="text-white font-semibold text-sm">
                Your Seras Helper
              </span>
              <button onClick={() => setChatOpen(false)} className="text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4  overflow-y-auto flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                    msg.type === "bot"
                      ? "bg-black border border-purple-500 self-start"
                      : "bg-black border border-blue-500 self-end"
                  }`}
                >
                  <span className="text-white">{msg.text}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-600 p-2 flex items-center">
              <input
                type="text"
                placeholder="Type To Chat"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-transparent text-white outline-none text-sm placeholder:text-white"
              />
              <button onClick={sendMessage}>
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setChatOpen(true)}
          className="hover:scale-105 transition-transform rounded-full overflow-hidden"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuzdk7Yy8f5orGWH3_R0cV-qWqqc7-b_j9Kg&s"
            alt="Chatbot"
            width={50}
            height={50}
            className="rounded-full"
          />
        </button>
      </div>
    </div>
  );
}
