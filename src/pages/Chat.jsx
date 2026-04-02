"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoSrc from "../assets/assets/img/logo/logo.png";
import { sendChatMessage, checkVideoStatus } from "../utils/mediaApi";
import chatbotAvatar from "../images/chatbot.png";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
// floating widget, and scoped styles. Keeps all effects local to this page only.

export default function Chat() {
  // ---------- User / Avatar context ----------
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);
  const userName =
    user?.name || user?.first_name || user?.full_name || user?.email || "Guest";
  const credits =
    user?.credits ?? user?.credit ?? user?.balance ?? user?.wallet_amount ?? 0;
  const profileAvatarUrl =
    user?.profile_image ||
    user?.avatar_url ||
    localStorage.getItem("createdAvatarImageUrl") ||
    "https://www.bootdey.com/img/Content/avatar/avatar2.png";

  const location = useLocation();
  const navigate = useNavigate();

  const routeAvatarId = location?.state?.avatarId;
  const avatarId = useMemo(() => {
    // Prefer route state; otherwise fallback to storage; default to "2"
    if (routeAvatarId !== undefined && routeAvatarId !== null)
      return String(routeAvatarId);
    const raw = localStorage.getItem("createdAvatarId");
    return raw ? String(raw) : "2";
  }, [routeAvatarId]);

  const avatarPreviewUrl =
    location?.state?.avatarImageUrl ||
    localStorage.getItem("createdAvatarImageUrl") ||
    "/avatar-preview.png";

  // ---------- Main conversation (center input) ----------
  const [mainInput, setMainInput] = useState("");
  const [voiceType, setVoiceType] = useState("default_female");

  const [sending, setSending] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState("processing…");

  // messages: [{role: "user"|"bot", text, audio_url?, video_url?, video_model_id?, status_text?}]
  const [messages, setMessages] = useState([]);

  // localStorage se value load kar ke state set karo
  useEffect(() => {
    const savedVoice = localStorage.getItem("voice_type");
    if (savedVoice) {
      setVoiceType(savedVoice);
    }
  }, []);

  ////////////////////////////////////////
  const voiceLabel = useMemo(() => {
    if (!voiceType) return "Select Voice";

    if (voiceType === "default-male" || voiceType === "default_male") {
      return "Male Voice";
    }

    if (voiceType === "default-female" || voiceType === "default_female") {
      return "Female Voice";
    }

    // 🔥 agar default male/female nahi hai
    return "Your Voice";
  }, [voiceType]);

  //////////////////////////////
  const messagesEndRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {}
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend(source = "main") {
    const content = source === "main" ? mainInput.trim() : miniInput.trim();
    if (!content) return;

    // Push the user message to the relevant pane first
    if (source === "main") {
      setMessages((prev) => [...prev, { role: "user", text: content }]);
      setMainInput("");
      setSending(true);
      if (!chatOpen) setChatOpen(true);
    } else {
      setMiniMessages((prev) => [...prev, { role: "user", text: content }]);
      setMiniInput("");
      setMiniSending(true);
    }

    setProcessing(true);
    setProcessingText("processing…");

    try {
      const payload = {
        avatar_id: String(avatarId), // ensure string per backend requirement
        message: content,
        voice_type: voiceType,
      };
      // console.log("Chat.jsx sending payload:", payload, { typeOfAvatarId: typeof payload.avatar_id })
      const data = await sendChatMessage(payload);

      // console.log("[v0] Chat.jsx received response:", data)

      const botMsg = {
        role: "bot",
        text: data?.response_text || "…",
        audio_url: data?.audio_url || "",
        video_url: data?.video_url || "",
        video_model_id: data?.video_model_id || "",
        status_text: data?.status_text || "",
      };

      const willGenerateVideo = !botMsg.video_url && !!botMsg.video_model_id;
      if (!willGenerateVideo) {
        // no video to generate or already ready
        setProcessing(false);
      } else {
        // keep processing true; update status text if provided
        setProcessingText(botMsg.status_text || "processing…");
      }

      if (source === "main") {
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMiniMessages((prev) => [...prev, botMsg]);
      }

      if (willGenerateVideo) {
        startVideoPolling(botMsg.video_model_id, source);
      }
    } catch (e) {
      const errText = "Failed to send. Please try again.";
      if (source === "main") {
        setMessages((prev) => [...prev, { role: "bot", text: errText }]);
      } else {
        setMiniMessages((prev) => [...prev, { role: "bot", text: errText }]);
      }

      setProcessing(false);
    } finally {
      if (source === "main") setSending(false);
      else setMiniSending(false);
    }
  }

  // ---------- Poll video status ----------
  const pollingRefMain = useRef(null);
  const pollingRefMini = useRef(null);

  function startVideoPolling(videoModelId, pane = "main") {
    const ref = pane === "main" ? pollingRefMain : pollingRefMini;
    // setProcessing(true)

    // Clear previous interval if any
    if (ref.current) clearInterval(ref.current);
    ref.current = setInterval(async () => {
      try {
        const res = await checkVideoStatus(videoModelId);
        const ready =
          res?.is_ready === true ||
          res?.video_status === 3 ||
          /completed/i.test(res?.status_text || "");
        if (ready) {
          if (pane === "main") {
            setMessages((prev) => {
              const next = [...prev];
              for (let i = next.length - 1; i >= 0; i--) {
                const m = next[i];
                if (m.role === "bot" && m.video_model_id === videoModelId) {
                  next[i] = { ...m, video_url: res?.video_url || m.video_url };
                  break;
                }
              }
              return next;
            });
          } else {
            setMiniMessages((prev) => {
              const next = [...prev];
              for (let i = next.length - 1; i >= 0; i--) {
                const m = next[i];
                if (m.role === "bot" && m.video_model_id === videoModelId) {
                  next[i] = { ...m, video_url: res?.video_url || m.video_url };
                  break;
                }
              }
              return next;
            });
          }
          clearInterval(ref.current);
          ref.current = null;
          setProcessing(false);
          // setTimeout(() => navigate("/"), 300);
        } else {
          // Optionally update status text
          const statusText = res?.status_text || "processing…";
          setProcessingText(statusText);
        }
      } catch (e) {
        // stop polling on error
        clearInterval(ref.current);
        ref.current = null;
        setProcessing(false);
      }
    }, 2000);
  }

  useEffect(() => {
    return () => {
      if (pollingRefMain.current) clearInterval(pollingRefMain.current);
      if (pollingRefMini.current) clearInterval(pollingRefMini.current);
    };
  }, []);

  // ---------- Mini floating chat ----------
  const [chatOpen, setChatOpen] = useState(false);
  const [miniSending, setMiniSending] = useState(false);
  const [miniInput, setMiniInput] = useState("");
  const [miniMessages, setMiniMessages] = useState([]); // remove seeded default messages from mini floating chat
  const miniMessagesRef = useRef(null);
  useEffect(() => {
    try {
      const el = miniMessagesRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }, [miniMessages]);

  return (
    <div className="chatjsx-override">
      {/* Header override (scoped to chat page, non-fixed to avoid affecting layout on other pages) */}
      <Header1 />

      {/* Main section */}
      <section className="pt-30 pb-120  mb-5">
        <div className="container">
          <div className="row align-items-start justify-content-center gap-5">
            {/* Left: Avatar and input */}
            <div className="col-lg-7 text-center">
              <h1 className="mb-3">Start a conversation</h1>
              <p className="mb-5 text-white">
                Start to interact with your customized Avatar
              </p>

              <div className="avatar-container mb-5 position-relative">
                <img
                  src={avatarPreviewUrl || "/placeholder.svg"}
                  className="avatar"
                  alt="Avatar preview"
                  style={{
                    width: 280,
                    height: 280,
                    objectFit: "cover",
                    borderRadius: 12,
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>

              {/* Voice selection + input + send */}
              <div className="controls-row mx-auto">
                {/* <select
                  className="select"
                  style={{ textAlign: "center", textAlignLast: "center" }}
                  value={voiceType}
                  onChange={(e) => setVoiceType(e.target.value)}
                  aria-label="Select voice"
                >
                  <option value="default_male">{voiceLabel}</option>
                  <option value="neutral">Neutral</option>
                  <option value="default_male">Default male</option>
                  <option value="default_female">Default Female</option>
                </select> */}

                <h4
                  className="select"
                  style={{ textAlign: "center", textAlignLast: "center" }}
                >
                  {voiceLabel}
                </h4>

                <div
                  className="chat-input-wrapper"
                  role="form"
                  aria-label="Send a message"
                >
                  <span className="icon-left" aria-hidden>
                    🎙️
                  </span>
                  <input
                    type="text"
                    placeholder="Type message"
                    className="chat-input"
                    value={mainInput}
                    onChange={(e) => setMainInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !sending && handleSend("main")
                    }
                  />
                  <button
                    className="icon-right"
                    type="button"
                    aria-label="Send"
                    onClick={() => handleSend("main")}
                    disabled={sending}
                    title="Send"
                  >
                    {sending ? "…" : "➤"}
                  </button>
                </div>
              </div>

              {/* Conversation preview (simple) */}
              <div className="conversation">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "bot" ? "msg bot" : "msg user"}
                  >
                    <div className="text">{m.text}</div>
                    {!!m.status_text && !m.video_url && (
                      <div className="hint">Status: {m.status_text}</div>
                    )}
                    {m.audio_url ? (
                      <audio src={m.audio_url} controls preload="none" />
                    ) : null}
                    {m.video_url ? (
                      <video
                        src={m.video_url}
                        className="video"
                        controls
                        playsInline
                        preload="none"
                      />
                    ) : null}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Right: Floating mini-chat trigger and box (fixed), rendered here for DOM locality */}
            <div className="col-lg-4" />
          </div>
        </div>

        {/* Floating Mini Chat */}
        <div className="chatbot-container" style={{ zIndex: 30 }}>
          {/* Chat box */}
          <div
            className="chatbot-box"
            style={{ display: chatOpen ? "block" : "none" }}
          >
            <div className="chatbot-header">
              Your Seras Helper
              <span
                className="close-btn"
                onClick={() => setChatOpen(false)}
                role="button"
                aria-label="Close"
              >
                &times;
              </span>
            </div>

            <div className="chatbot-messages" ref={miniMessagesRef}>
              {miniMessages.map((m, i) => (
                <div
                  key={i}
                  className={m.role === "bot" ? "bot-message" : "user-message"}
                >
                  <div>{m.text}</div>
                  {!!m.status_text && !m.video_url && (
                    <small style={{ opacity: 0.8 }}>
                      Status: {m.status_text}
                    </small>
                  )}
                  {m.audio_url ? (
                    <audio src={m.audio_url} controls preload="none" />
                  ) : null}
                  {m.video_url ? (
                    <video
                      className="mini-video"
                      src={m.video_url}
                      controls
                      playsInline
                      preload="none"
                    />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                placeholder="Type To Chat"
                value={miniInput}
                onChange={(e) => setMiniInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !miniSending && handleSend("mini")
                }
              />
              <span
                className="send-icon"
                onClick={() => handleSend("mini")}
                role="button"
                aria-label="Send"
                aria-busy={miniSending}
              >
                {miniSending ? "…" : "➤"}
              </span>
            </div>
          </div>

          {/* Bot Icon Button */}
          {!chatOpen && (
            <button
              className="bot-avatar"
              onClick={() => setChatOpen(true)}
              aria-label="Open chat"
              style={{ border: "none", background: "transparent", padding: 0 }}
            >
              <img src={`${chatbotAvatar}`} alt="Open Chat" />
            </button>
          )}
        </div>
      </section>

      {processing && (
        <div
          className="processing-overlay"
          role="alert"
          aria-live="assertive"
          aria-busy="true"
        >
          <div className="processing-box">
            <div className="spinner" aria-hidden="true" />
            <div className="processing-title">Generating your video</div>
            <div className="processing-subtitle">
              {processingText || "processing..."}
            </div>
            <div className="processing-hint">
              This may take up to a minute. Please keep this tab open.
            </div>
          </div>
        </div>
      )}

      {/* Footer (kept structural; uses site styles if present) */}
      {/* <footer className="footer__section footer__section__five">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__bottom footer__bottom__two">
              <ul className="footer__bottom__link">
                <li>
                  <Link to="/support">Terms</Link>
                </li>
                <li>
                  <Link to="/support">Privacy</Link>
                </li>
                <li>
                  <Link to="/support">Cookies</Link>
                </li>
              </ul>
              <p>© 2025 By Aiseras. All Rights Reserved.</p>
              <ul className="social">
                <li>
                  <Link to="#" className="social__item">
                    <span className="icon">F</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="social__item social__itemtwo">
                    <span className="icon">I</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="social__item social__itemthree">
                    <span className="icon">X</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="social__item social__itemfour">
                    <span className="icon">in</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer> */}

      <Footer/>
      
      {/* Scoped page styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.chatjsx-override {
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
 
  min-height: 100vh;
  font-family: Arial, sans-serif;
}
.chatjsx-override .container { max-width: 100%; margin: 0 auto; padding: 20px; }
.header-section { padding: 12px 0; }
.avatarmsg {
  border: 1px solid #ddd;
  border-image: linear-gradient(to right, #7e12e5, #191ccb, #9C27B0) 1;
  top: -20px; right: -20px; position: absolute;
  background: rgba(0,0,0,.6);
  color: #fff; border-radius: 12px;
}
.controls-row {
  display: flex; align-items: center; gap: 12px; justify-content: center;
  flex-wrap: wrap; margin-bottom: 18px;
}
.select {
  appearance: none; background: #0b0b0b; color: #fff; border: 1px solid #1E92FFCC;
  padding: 10px 12px; border-radius: 10px; min-width: 180px;
}
.chat-input-wrapper {
  position: relative; width: 100%; max-width: 680px; height: 48px;
  border: 1px solid #1E92FFCC; border-radius: 12px;
  display: flex; align-items: center; background-color: #000; padding: 0 40px;
  margin: 0 auto;
  z-index: 40; /* ensure above floating button */
}
.chat-input { flex: 1; height: 100%; background: transparent; border: none; outline: none; color: white; font-size: 16px; }
.icon-left { position: absolute; left: 12px; color: #c100f9; font-size: 16px; }
.icon-right { position: absolute; right: 12px; color: #c100f9; font-size: 16px; cursor: pointer; background: transparent; border: none; }
.conversation { max-width: 760px; margin: 18px auto 0; display: flex; flex-direction: column; gap: 12px; }
.msg { display: flex; flex-direction: column; gap: 8px; }
.msg .text { padding: 10px 12px; border-radius: 10px; max-width: 100%; line-height: 1.5; }
.msg.user .text { background: #000; border: 1px solid #1f8bff; align-self: flex-end; }
.msg.bot .text  { background: #000; border: 1px solid #b636ff; align-self: flex-start; }
.msg .hint { color: #bbb; font-size: 12px; }
.video { width: 100%; max-width: 480px; border: 1px solid #2b2b2b; border-radius: 8px; background: #000; }

.chatbot-container { position: fixed; bottom: 15%; right: 20px; z-index: 30; display: flex; flex-direction: column; align-items: flex-end; }
.chatbot-box { background: #0c0c0c; border-radius: 16px; width: 320px; box-shadow: 0 0 12px rgba(202,0,255,.4); overflow: hidden; margin-bottom: 12px; border: 1px solid #3b3b3b; }
.chatbot-header { background: #1c1c2e; padding: 12px 16px; font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; align-items: center; }
.close-btn { cursor: pointer; font-size: 16px; color: #fff; }
.chatbot-messages { padding: 16px; display: flex; flex-direction: column; gap: 10px; max-height: 320px; overflow-y: auto; }
.bot-message, .user-message { padding: 8px 12px; border-radius: 10px; font-size: 13px; max-width: 85%; line-height: 1.4; }
.bot-message { background-color: #000; border: 1px solid #b636ff; align-self: flex-start; }
.user-message { background-color: #000; border: 1px solid #1f8bff; align-self: flex-end; }
.mini-video { width: 100%; border-radius: 8px; border: 1px solid #2b2b2b; }
.chatbot-input-area { background: #227ce8; display: flex; align-items: center; padding: 8px 12px; gap: 8px; }
.chatbot-input-area input { flex: 1; background: transparent; border: none; outline: none; color: white; font-size: 13px; }
.chatbot-input-area input::placeholder { color: #fff; opacity: 1; }
.send-icon { color: white; font-size: 16px; cursor: pointer; }
.bot-avatar { padding: 6px; border-radius: 50%; cursor: pointer; }
.bot-avatar img { width: 120px; display: block; }

/* Ensure the floating button never overlaps the send button visually */
@media (max-width: 768px) {
  .chatbot-container { bottom: 90px; right: 16px; }
}

/* Overlay styles */
.processing-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.processing-box {
  background: #0b0b0b;
  border: 1px solid #1E92FFCC;
  border-radius: 12px;
  padding: 24px 28px;
  width: min(92vw, 420px);
  text-align: center;
  color: #fff;
}
.spinner {
  width: 40px; height: 40px;
  border-radius: 9999px;
  border: 3px solid rgba(200,200,200,0.2);
  border-top-color: #c100f9;
  margin: 0 auto 14px auto;
  animation: spin 0.9s linear infinite;
}
.processing-title { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
.processing-subtitle { font-size: 14px; opacity: .9; margin-bottom: 8px; }
.processing-hint { font-size: 12px; opacity: .7; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
          `,
        }}
      />
    </div>
  );
}
