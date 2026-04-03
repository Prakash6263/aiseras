"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  checkVideoStatus,
  sendChatMessage,
  uploadStreamingAvatar,
  checkStreamingAvatarStatus,
  createStreamingSession,
  sendStreamingTalk,
} from "../utils/mediaApi";
import chatbotAvatar from "../images/chatbot.png";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

// ─── Streaming phases ───────────────────────────────────────────────
// idle → uploading → waiting_stream_ready → creating_session → live → error
const PHASE = {
  IDLE: "idle",
  UPLOADING: "uploading",
  WAITING_STREAM_READY: "waiting_stream_ready",
  CREATING_SESSION: "creating_session",
  LIVE: "live",
  ERROR: "error",
};

export default function Chat() {
  // ─── User / Avatar context ───────────────────────────────────────
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

  const location = useLocation();
  const navigate = useNavigate();

  const routeAvatarId = location?.state?.avatarId;
  const akoolAvatarId = useMemo(() => {
    if (routeAvatarId !== undefined && routeAvatarId !== null)
      return String(routeAvatarId);
    const raw = localStorage.getItem("createdAvatarId");
    return raw ? String(raw) : null;
  }, [routeAvatarId]);

  // The video_url that came from /chat (video generation flow) stored in localStorage
  const storedVideoUrl = localStorage.getItem("createdAvatarVideoUrl") || null;

  const avatarPreviewUrl =
    location?.state?.avatarImageUrl ||
    localStorage.getItem("createdAvatarImageUrl") ||
    "/avatar-preview.png";

  const voiceType = useMemo(() => {
    return localStorage.getItem("voice_type") || "en-US-female-1";
  }, []);

  const voiceLabel = useMemo(() => {
    if (!voiceType) return "Select Voice";
    if (voiceType === "default-male" || voiceType === "default_male") return "Male Voice";
    if (voiceType === "default-female" || voiceType === "default_female") return "Female Voice";
    return "Your Voice";
  }, [voiceType]);

  // ─── Streaming state ─────────────────────────────────────────────
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [phaseText, setPhaseText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [streamingAvatarId, setStreamingAvatarId] = useState(null); // local streaming avatar id

  // ─── Agora state ─────────────────────────────────────────────────
  const agoraClientRef = useRef(null);
  const localStreamChannelRef = useRef(null); // for DataStream
  const remoteVideoRef = useRef(null); // <div> to attach remote video
  const [isConnected, setIsConnected] = useState(false);

  // ─── Chat messages ───────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [mainInput, setMainInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    try { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); } catch {}
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ─── Mini floating chat ──────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [miniInput, setMiniInput] = useState("");
  const [miniMessages, setMiniMessages] = useState([]);
  const [miniSending, setMiniSending] = useState(false);
  const miniMessagesRef = useRef(null);
  useEffect(() => {
    try {
      const el = miniMessagesRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }, [miniMessages]);

  // ─── Polling ref ─────────────────────────────────────────────────
  const streamStatusPollingRef = useRef(null);

  // ─── Step 1: Start streaming setup ───────────────────────────────
  // This runs on mount: we need akoolAvatarId + a video_url
  // The video_url should come from the prior /chat flow (stored in localStorage as createdAvatarVideoUrl)
  // If not present, we try to generate it via the old chat flow first, then stream.
  async function startStreamingSetup(videoUrl, akoolId) {
    try {
      // Step 1: Upload to streaming
      setPhase(PHASE.UPLOADING);
      setPhaseText("Uploading avatar for live streaming…");

      const uploadRes = await uploadStreamingAvatar({
        video_url: videoUrl,
        akool_avatar_id: akoolId,
        name: "My Live Avatar",
      });

      if (!uploadRes?.success && !uploadRes?.avatar_id) {
        throw new Error(uploadRes?.message || "Streaming upload failed");
      }

      // Strip hyphens from avatar_id for status check (as in curl example)
      const rawId = uploadRes.avatar_id || akoolId;
      const strippedId = rawId.replace(/-/g, "");
      setStreamingAvatarId(strippedId);

      // Step 2: Poll streaming avatar status
      setPhase(PHASE.WAITING_STREAM_READY);
      setPhaseText("Preparing your live avatar… this may take a minute.");
      pollStreamingAvatarStatus(strippedId);
    } catch (err) {
      setPhase(PHASE.ERROR);
      setErrorMsg(err.message || "Failed to start streaming setup.");
    }
  }

  function pollStreamingAvatarStatus(strippedAvatarId) {
    if (streamStatusPollingRef.current) clearInterval(streamStatusPollingRef.current);
    streamStatusPollingRef.current = setInterval(async () => {
      try {
        const statusRes = await checkStreamingAvatarStatus(strippedAvatarId);
        const ready = statusRes?.is_ready === true || statusRes?.status === 3;
        if (ready) {
          clearInterval(streamStatusPollingRef.current);
          streamStatusPollingRef.current = null;
          await startSession(strippedAvatarId);
        } else {
          setPhaseText(`Preparing avatar… status: ${statusRes?.status_text || "processing"}`);
        }
      } catch (err) {
        clearInterval(streamStatusPollingRef.current);
        streamStatusPollingRef.current = null;
        setPhase(PHASE.ERROR);
        setErrorMsg("Failed to check streaming avatar status.");
      }
    }, 3000);
  }

  // ─── Step 3: Create session + join Agora ────────────────────────
  async function startSession(strippedAvatarId) {
    try {
      setPhase(PHASE.CREATING_SESSION);
      setPhaseText("Creating live session…");

      const sessionRes = await createStreamingSession({
        akool_avatar_id: strippedAvatarId,
        voice_id: voiceType.startsWith("en-") ? voiceType : "en-US-female-1",
        duration: 3600,
        language: "en",
        mode_type: 2,
      });

      const sid = sessionRes?.akool_session_id;
      const creds = sessionRes?.agora_credentials;

      if (!sid || !creds) {
        throw new Error("Invalid session response");
      }

      setSessionId(sid);
      await joinAgoraChannel(creds);
    } catch (err) {
      setPhase(PHASE.ERROR);
      setErrorMsg(err.message || "Failed to create streaming session.");
    }
  }

  // ─── Step 4: Join Agora channel ─────────────────────────────────
  async function joinAgoraChannel({ agora_app_id, agora_channel, agora_token, agora_uid }) {
    try {
      setPhaseText("Joining live channel…");

      const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      client.setClientRole("audience");
      agoraClientRef.current = client;

      // Listen for remote user publishing video/audio
      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === "video") {
          const remoteVideoTrack = remoteUser.videoTrack;
          if (remoteVideoRef.current) {
            remoteVideoTrack.play(remoteVideoRef.current);
          }
          setPhase(PHASE.LIVE);
          setIsConnected(true);
        }
        if (mediaType === "audio") {
          remoteUser.audioTrack?.play();
        }
      });

      client.on("user-unpublished", () => {
        setIsConnected(false);
      });

      // Create DataStream for sending agora_message_payload
      await client.join(agora_app_id, agora_channel, agora_token, agora_uid);

      // Create DataStream channel
      const streamChannelId = await client.createDataStream({ reliable: true, ordered: true });
      localStreamChannelRef.current = streamChannelId;

      setPhase(PHASE.LIVE);
      setIsConnected(true);
    } catch (err) {
      setPhase(PHASE.ERROR);
      setErrorMsg("Failed to join Agora channel: " + (err.message || "Unknown error"));
    }
  }

  // ─── Send Agora DataStream message ──────────────────────────────
  async function sendAgoraDataStreamMessage(payload) {
    try {
      const client = agoraClientRef.current;
      const streamId = localStreamChannelRef.current;
      if (!client || streamId === null || streamId === undefined) return;
      const msgStr = JSON.stringify(payload);
      const encoder = new TextEncoder();
      await client.sendStreamMessage(streamId, encoder.encode(msgStr));
    } catch (err) {
      console.log("[v0] Failed to send Agora DataStream message:", err.message);
    }
  }

  // ─── Handle sending a chat message ──────────────────────────────
  async function handleSend(source = "main") {
    const content = source === "main" ? mainInput.trim() : miniInput.trim();
    if (!content || !sessionId) return;

    if (source === "main") {
      setMessages((prev) => [...prev, { role: "user", text: content }]);
      setMainInput("");
      setSending(true);
    } else {
      setMiniMessages((prev) => [...prev, { role: "user", text: content }]);
      setMiniInput("");
      setMiniSending(true);
    }

    try {
      const talkRes = await sendStreamingTalk({
        akool_session_id: sessionId,
        message: content,
      });

      const responseText = talkRes?.response_text || "…";
      const agoraPayload = talkRes?.agora_message_payload;

      // Send agora_message_payload via Agora DataStream so avatar speaks
      if (agoraPayload) {
        await sendAgoraDataStreamMessage(agoraPayload);
      }

      const botMsg = { role: "bot", text: responseText };
      if (source === "main") {
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMiniMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      const errText = "Failed to send. Please try again.";
      if (source === "main") {
        setMessages((prev) => [...prev, { role: "bot", text: errText }]);
      } else {
        setMiniMessages((prev) => [...prev, { role: "bot", text: errText }]);
      }
    } finally {
      if (source === "main") setSending(false);
      else setMiniSending(false);
    }
  }

  // ─── Initialise on mount ─────────────────────────────────────────
  // We need: akoolAvatarId + a video_url for the streaming upload.
  // The video_url is generated from the /chat API flow (stored in localStorage as "createdAvatarVideoUrl").
  // If it's already stored, use it directly. Otherwise, we generate it first.
  const initDoneRef = useRef(false);

  useEffect(() => {
    if (initDoneRef.current) return;
    initDoneRef.current = true;

    const videoUrl = storedVideoUrl;
    const akoolId = akoolAvatarId;

    if (!akoolId) {
      setPhase(PHASE.ERROR);
      setErrorMsg("No avatar ID found. Please create an avatar first.");
      return;
    }

    if (!videoUrl) {
      // Need to generate video first via /chat, then stream
      setPhase(PHASE.IDLE);
      setPhaseText("Please send a message below to begin. A video will be generated, then your live avatar will start.");
      return;
    }

    startStreamingSetup(videoUrl, akoolId);

    return () => {
      if (streamStatusPollingRef.current) clearInterval(streamStatusPollingRef.current);
      if (agoraClientRef.current) {
        agoraClientRef.current.leave().catch(() => {});
        agoraClientRef.current = null;
      }
    };
  }, []);

  // ─── If no video_url yet, use the old /chat flow to generate one first ───
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [generatingText, setGeneratingText] = useState("");
  const videoPollingRef = useRef(null);

  async function handleBootstrapSend() {
    const content = mainInput.trim();
    if (!content || !akoolAvatarId || generatingVideo) return;

    setMessages((prev) => [...prev, { role: "user", text: content }]);
    setMainInput("");
    setGeneratingVideo(true);
    setGeneratingText("Generating your avatar video…");

    try {
      const payload = {
        avatar_id: String(akoolAvatarId),
        message: content,
        voice_type: voiceType,
      };
      const data = await sendChatMessage(payload);

      const botMsg = {
        role: "bot",
        text: data?.response_text || "…",
        video_url: data?.video_url || "",
        video_model_id: data?.video_model_id || "",
        status_text: data?.status_text || "",
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!botMsg.video_url && botMsg.video_model_id) {
        // Poll until video is ready
        setGeneratingText(botMsg.status_text || "Processing video…");
        startVideoPolling(botMsg.video_model_id, botMsg.video_url);
      } else if (botMsg.video_url) {
        // Video is immediately ready
        localStorage.setItem("createdAvatarVideoUrl", botMsg.video_url);
        setGeneratingVideo(false);
        await startStreamingSetup(botMsg.video_url, akoolAvatarId);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Failed to send. Please try again." }]);
      setGeneratingVideo(false);
    }
  }

  function startVideoPolling(videoModelId) {
    if (videoPollingRef.current) clearInterval(videoPollingRef.current);
    videoPollingRef.current = setInterval(async () => {
      try {
        const res = await checkVideoStatus(videoModelId);
        const ready = res?.is_ready === true || res?.video_status === 3 || /completed/i.test(res?.status_text || "");
        if (ready && res?.video_url) {
          clearInterval(videoPollingRef.current);
          videoPollingRef.current = null;
          // Update message with video_url
          setMessages((prev) => {
            const next = [...prev];
            for (let i = next.length - 1; i >= 0; i--) {
              if (next[i].role === "bot" && next[i].video_model_id === videoModelId) {
                next[i] = { ...next[i], video_url: res.video_url };
                break;
              }
            }
            return next;
          });
          localStorage.setItem("createdAvatarVideoUrl", res.video_url);
          setGeneratingVideo(false);
          // Now start streaming
          await startStreamingSetup(res.video_url, akoolAvatarId);
        } else {
          setGeneratingText(res?.status_text || "Processing…");
        }
      } catch {
        clearInterval(videoPollingRef.current);
        videoPollingRef.current = null;
        setGeneratingVideo(false);
      }
    }, 2000);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoPollingRef.current) clearInterval(videoPollingRef.current);
      if (streamStatusPollingRef.current) clearInterval(streamStatusPollingRef.current);
      if (agoraClientRef.current) {
        agoraClientRef.current.leave().catch(() => {});
        agoraClientRef.current = null;
      }
    };
  }, []);

  const isBootstrapMode = phase === PHASE.IDLE && !storedVideoUrl;

  return (
    <div className="chatjsx-override">
      <Header1 />

      <section className="pt-30 pb-120 mb-5">
        <div className="container">
          <div className="row align-items-start justify-content-center gap-5">
            {/* Left: Avatar / Live Stream + input */}
            <div className="col-lg-7 text-center">
              <h1 className="mb-3">
                {phase === PHASE.LIVE ? "Live Avatar Chat" : "Start a conversation"}
              </h1>
              <p className="mb-5 text-white">
                {phase === PHASE.LIVE
                  ? "You are now talking live with your avatar"
                  : "Start to interact with your customized Avatar"}
              </p>

              {/* Live Video or Avatar Preview */}
              <div className="avatar-container mb-5 position-relative">
                {/* Remote live video div (shown when live) */}
                <div
                  ref={remoteVideoRef}
                  id="agora-remote-video"
                  style={{
                    display: phase === PHASE.LIVE ? "block" : "none",
                    width: 320,
                    height: 420,
                    borderRadius: 12,
                    overflow: "hidden",
                    margin: "0 auto",
                    background: "#000",
                    border: "2px solid #c100f9",
                    boxShadow: "0 0 24px rgba(193,0,249,0.4)",
                  }}
                />

                {/* Fallback: avatar image preview (when not live) */}
                {phase !== PHASE.LIVE && (
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
                )}

                {/* Live indicator badge */}
                {phase === PHASE.LIVE && isConnected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#c100f9",
                      color: "#fff",
                      padding: "4px 14px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#fff",
                        display: "inline-block",
                        animation: "pulse 1.2s ease-in-out infinite",
                      }}
                    />
                    LIVE
                  </div>
                )}
              </div>

              {/* Voice label */}
              <div className="controls-row mx-auto">
                <h4 className="select" style={{ textAlign: "center", textAlignLast: "center" }}>
                  {voiceLabel}
                </h4>

                {/* Chat input (only enabled when live OR in bootstrap mode) */}
                <div
                  className="chat-input-wrapper"
                  role="form"
                  aria-label="Send a message"
                  style={{ opacity: (phase === PHASE.LIVE || isBootstrapMode) && !generatingVideo ? 1 : 0.5 }}
                >
                  <span className="icon-left" aria-hidden>🎙️</span>
                  <input
                    type="text"
                    placeholder={
                      phase === PHASE.LIVE
                        ? "Talk to your live avatar…"
                        : isBootstrapMode
                        ? "Type a message to start your avatar…"
                        : "Preparing live session…"
                    }
                    className="chat-input"
                    value={mainInput}
                    onChange={(e) => setMainInput(e.target.value)}
                    disabled={phase !== PHASE.LIVE && !isBootstrapMode}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      if (phase === PHASE.LIVE && !sending) handleSend("main");
                      else if (isBootstrapMode && !generatingVideo) handleBootstrapSend();
                    }}
                  />
                  <button
                    className="icon-right"
                    type="button"
                    aria-label="Send"
                    onClick={() => {
                      if (phase === PHASE.LIVE) handleSend("main");
                      else if (isBootstrapMode) handleBootstrapSend();
                    }}
                    disabled={(phase !== PHASE.LIVE && !isBootstrapMode) || sending || generatingVideo}
                    title="Send"
                  >
                    {sending || generatingVideo ? "…" : "➤"}
                  </button>
                </div>
              </div>

              {/* Conversation messages */}
              <div className="conversation">
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "bot" ? "msg bot" : "msg user"}>
                    <div className="text">{m.text}</div>
                    {!!m.status_text && !m.video_url && (
                      <div className="hint">Status: {m.status_text}</div>
                    )}
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

            <div className="col-lg-4" />
          </div>
        </div>

        {/* ─── Floating Mini Chat ─── */}
        <div className="chatbot-container" style={{ zIndex: 30 }}>
          <div className="chatbot-box" style={{ display: chatOpen ? "block" : "none" }}>
            <div className="chatbot-header">
              Your Seras Helper
              <span className="close-btn" onClick={() => setChatOpen(false)} role="button" aria-label="Close">
                &times;
              </span>
            </div>

            <div className="chatbot-messages" ref={miniMessagesRef}>
              {miniMessages.map((m, i) => (
                <div key={i} className={m.role === "bot" ? "bot-message" : "user-message"}>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>

            <div className="chatbot-input-area">
              <input
                type="text"
                placeholder="Type To Chat"
                value={miniInput}
                onChange={(e) => setMiniInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !miniSending && handleSend("mini")}
              />
              <span
                className="send-icon"
                onClick={() => handleSend("mini")}
                role="button"
                aria-label="Send"
              >
                {miniSending ? "…" : "➤"}
              </span>
            </div>
          </div>

          {!chatOpen && (
            <button
              className="bot-avatar"
              onClick={() => setChatOpen(true)}
              aria-label="Open chat"
              style={{ border: "none", background: "transparent", padding: 0 }}
            >
              <img src={chatbotAvatar} alt="Open Chat" />
            </button>
          )}
        </div>
      </section>

      {/* ─── Setup / Loading Overlay ─── */}
      {(phase === PHASE.UPLOADING ||
        phase === PHASE.WAITING_STREAM_READY ||
        phase === PHASE.CREATING_SESSION ||
        generatingVideo) && (
        <div className="processing-overlay" role="alert" aria-live="assertive" aria-busy="true">
          <div className="processing-box">
            <div className="spinner" aria-hidden="true" />
            <div className="processing-title">
              {generatingVideo
                ? "Generating Avatar Video"
                : phase === PHASE.UPLOADING
                ? "Uploading to Live Stream"
                : phase === PHASE.WAITING_STREAM_READY
                ? "Preparing Live Avatar"
                : "Creating Live Session"}
            </div>
            <div className="processing-subtitle">
              {generatingVideo ? generatingText : phaseText}
            </div>
            <div className="processing-hint">
              This may take up to a minute. Please keep this tab open.
            </div>
          </div>
        </div>
      )}

      {/* ─── Error state ─── */}
      {phase === PHASE.ERROR && (
        <div className="processing-overlay" role="alert">
          <div className="processing-box" style={{ borderColor: "#ff4d4d" }}>
            <div className="processing-title" style={{ color: "#ff4d4d" }}>Something went wrong</div>
            <div className="processing-subtitle">{errorMsg}</div>
            <button
              onClick={() => {
                setPhase(PHASE.IDLE);
                setErrorMsg("");
              }}
              style={{
                marginTop: 16,
                padding: "10px 24px",
                borderRadius: 10,
                background: "linear-gradient(90deg,#8e2de2,#4a00e0)",
                border: "none",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <Footer />

      {/* ─── Scoped styles ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
.chatjsx-override {
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
  min-height: 100vh;
  font-family: Arial, sans-serif;
}
.chatjsx-override .container { max-width: 100%; margin: 0 auto; padding: 20px; }
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
  z-index: 40;
  transition: opacity 0.3s ease;
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
.chatbot-input-area { background: #227ce8; display: flex; align-items: center; padding: 8px 12px; gap: 8px; }
.chatbot-input-area input { flex: 1; background: transparent; border: none; outline: none; color: white; font-size: 13px; }
.chatbot-input-area input::placeholder { color: #fff; opacity: 1; }
.send-icon { color: white; font-size: 16px; cursor: pointer; }
.bot-avatar { padding: 6px; border-radius: 50%; cursor: pointer; }
.bot-avatar img { width: 120px; display: block; }

@media (max-width: 768px) {
  .chatbot-container { bottom: 90px; right: 16px; }
}

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

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
      ` }} />
    </div>
  );
}
