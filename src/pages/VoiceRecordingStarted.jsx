"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
import { Mic } from "lucide-react";

export default function VoiceRecordingStarted() {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const navigate = useNavigate();
  const userId = 18;

  // ⏱ Timer
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  // 🎙 Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      console.error(err);
      setError("Microphone permission denied or not found");
    }
  };

  // 🔼 Upload Voice API
  const uploadVoice = async (audioFile) => {
    const formData = new FormData();
    formData.append("file", audioFile);

    const url =
      `https://api.aiseras.com/aiseras/api/upload-voice` +
      `?user_id=${userId}` +
      `&voice_name=original_recorded_voice` +
      `&voice_description=User recorded voice`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_API_TOKEN",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Voice upload failed");
    }

    return response.json(); // ✅ returns voice_id
  };

  // ⏹ Stop + Upload + Next
  const handleNext = async () => {
    if (!mediaRecorderRef.current) return;

    setLoading(true);
    stopTimer();
    setIsRecording(false);

    mediaRecorderRef.current.onstop = async () => {
      try {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const audioFile = new File([audioBlob], "voice.webm", {
          type: "audio/webm",
        });

        // 🔥 Upload
        const response = await uploadVoice(audioFile);

        const voiceId = response.voice_id;

        // ✅ Save for safety (page refresh case)
        localStorage.setItem("voice_type", voiceId);

        // 👉 Next page with voice_id
        navigate("/chat", {
          state: { voiceId },
        });

      } catch (err) {
        console.error(err);
        alert("Voice upload failed");
      } finally {
        setLoading(false);
      }
    };

    mediaRecorderRef.current.stop();
  };

  // // ⏭️ Skip Upload
  // const handleSkip = () => {
  //   navigate("/voice-recording-completed", {
  //     state: { voiceId: null },
  //   });
  // };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(180deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      <Header1 />

      <section style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-5 fw-bold text-white mb-2">
                Sit Back and Relax
              </h1>

              <p className="text-secondary mb-4 text-white">
                Let Us Capture your Voice
              </p>

              {/* 🎙 Mic */}
              <div className="position-relative d-inline-block mb-4">
                <div
                  className="rounded-circle  border-4 d-flex align-items-center justify-content-center"
                  style={{
                    width: "250px",
                    height: "250px",
                    borderColor: "#a855f7",
                    cursor: isRecording ? "default" : "pointer",
                    background:
                      "linear-gradient(135deg, rgba(88,28,135,0.5), rgba(30,58,138,0.5))",
                  }}
                  onClick={!isRecording ? startRecording : undefined}
                >
                  {!isRecording ? (
                    <Mic size={64} color="#fff" />
                  ) : (
                    <span className="display-4 fw-bold text-white">
                      {formatTime(seconds)}
                    </span>
                  )}
                </div>
              </div>

              {error && <p className="text-danger">{error}</p>}

              <p className="text-secondary mb-4">
                {isRecording
                  ? "Recording in progress..."
                  : "Tap the mic to start recording"}
              </p>

              {/* Buttons */}
              <div className="d-flex justify-content-center gap-3">
                <Button
                  onClick={handleNext}
                  disabled={!isRecording || loading}
                  className="px-5"
                >
                  {loading ? "Uploading..." : "Next"}
                </Button>

                {/* <Button
                  onClick={handleSkip}
                  className="px-5 btn-secondary"
                >
                  Skip
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
