"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Check } from "lucide-react";

export default function VoiceRecordingCompleted() {
  // ✅ Default = male
  const [selectedVoice, setSelectedVoice] = useState("");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const navigate = useNavigate();

  // ---------- Voice selection handler ----------
  const handleVoiceSelect = (voice) => {
    setSelectedVoice(voice);

    // Remove stored voiceId if exists
    localStorage.removeItem("voiceId");

    // Set opposite default voice type in localStorage
    if (voice === "male") {
      localStorage.setItem("voice_type", "default_male");
    } else if (voice === "female") {
      localStorage.setItem("voice_type", "default_female");
    }
  };

  const handleConfirm = () => {
    // 🔥 Only selected voice send to chat page
    navigate("/chat", {
      state: {
        selectedVoice, // "male" | "female"
      },
    });
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
              <h1 className="display-6 fw-bold text-white mb-2">
                Captured Successfully
              </h1>

              <p className="text-secondary mb-4">
                Select a voice type to continue
              </p>

              {/* Success Indicator */}
              <div className="d-flex justify-content-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 250,
                    height: 250,
                    border: "4px solid #22c55e",
                  }}
                >
                  <Check size={48} color="#22c55e" />
                </div>
              </div>

              {/* Voice Selection */}
              <div className="d-flex justify-content-center gap-4 mb-5">
                {/* Male */}
                <div
                  onClick={() => handleVoiceSelect("male")}
                  className={`d-flex flex-column align-items-center cursor-pointer ${
                    selectedVoice === "male"
                      ? "border-2 border-primary p-2 rounded"
                      : ""
                  }`}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE9ML0QbGwOiQvUlDh1_E4PSKmHPyTRxjuaQ&s"
                    alt="Male"
                    className="rounded-circle mb-2"
                    style={{ width: 50, height: 50 }}
                  />
                  <span className="text-white fw-medium">Male</span>
                </div>

                {/* Female */}
                <div
                  onClick={() => handleVoiceSelect("female")}
                  className={`d-flex flex-column align-items-center cursor-pointer ${
                    selectedVoice === "female"
                      ? "border-2 border-primary p-2 rounded"
                      : ""
                  }`}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQubOqXHc2HoKH3DNq9wdTh_AgYj-3n33qXjw&s"
                    alt="Female"
                    className="rounded-circle mb-2"
                    style={{ width: 50, height: 50 }}
                  />
                  <span className="text-white fw-medium">Female</span>
                </div>
              </div>

              <Button
                onClick={() => setConfirmModalOpen(true)}
                className="rounded-pill"
                style={{ width: "220px", height: "45px" }}
              >
                Process
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      >
        <h3 className="text-white mb-4 text-center">Confirm Voice</h3>

        <p className="text-white text-center mb-4">
          Continue with <b>{selectedVoice}</b> voice
        </p>

        <Button
          className="w-100 rounded-pill"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Modal>

      <Footer />
    </div>
  );
}
