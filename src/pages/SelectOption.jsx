import React from "react";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

const SelectOption = () => {
  const navigate = useNavigate();

  const handleGender = (type) => {
    localStorage.setItem("voice_type", type);
    navigate("/chat");
  };

  return (
    <div>
      <Header1 />

      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(180deg, #131030, #2F2267)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center w-100">
            <div className="col-lg-6 col-md-8 col-11 text-center">
              {/* Back Button */}
              <button
                onClick={() => navigate("/customize")}
                style={{
                  position: "absolute",
                  top: 120,
                  left: 20,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 20,
                  color: "#fff",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.boxShadow = "0 0 12px rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
                title="Go back"
              >
                ←
              </button>
              <h2 className="mb-4 text-white fw-bold">
                Choose an Option
              </h2>

              <div className="d-grid gap-3">
                <button
                  className="btn gradient-btn btn-lg fw-semibold"
                  onClick={() => navigate("/addVoice")}
                >
                  📁 Upload Voice
                </button>

                <button
                  className="btn gradient-btn btn-lg fw-semibold"
                  onClick={() => navigate("/voice-recording-started")}
                >
                  🎙 Record Voice
                </button>

                <button
                  className="btn gradient-btn btn-lg fw-semibold"
                  onClick={() => handleGender("default-male")}
                >
                  👨 Male
                </button>

                <button
                  className="btn gradient-btn btn-lg fw-semibold"
                  onClick={() => handleGender("default-female")}
                >
                  👩 Female
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* 🔥 Scoped CSS */}
      <style>
        {`
          .gradient-btn {
            background: linear-gradient(180deg, #131030, #2F2267);
            color: #fff;
            border: 1px solid rgba(255,255,255,0.25);
            border-radius: 14px;
            transition: all 0.35s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          }

          .gradient-btn:hover {
            background: linear-gradient(180deg, #4f46e5, #9333ea);
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(147,51,234,0.6);
          }

          .gradient-btn:active {
            transform: scale(0.98);
          }
        `}
      </style>
    </div>
  );
};

export default SelectOption;
