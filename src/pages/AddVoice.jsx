import React, { useState } from "react";
import { uploadVoice } from "../utils/mediaApi";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
import { MdOutlineFileUpload } from "react-icons/md";

const AddVoice = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // 🔹 Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setError("Please upload an audio file");
    if (!file.type.startsWith("audio/")) {
      setError("Only audio files are allowed");
      e.target.value = "";
      return;
    }
    setError("");
    setAudioFile(file);
  };

  // 🔹 Handle upload
  const handleUpload = async () => {
    if (!audioFile) return setError("Please select an audio file first");

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const response = await uploadVoice(audioFile);
      const voiceId = response.voice_id;

      localStorage.setItem("voice_type", voiceId);

      setSuccess("Voice uploaded successfully!");
      navigate("/chat");
    } catch (err) {
      console.error(err);
      setError("Voice upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* HEADER */}
      <Header1 />

      {/* MAIN CONTENT */}
      <div
        className="flex-grow-1 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(180deg, #131030, #2F2267)",
          padding: "1rem 0",
        }}
      >
        <div className="container py-24">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7 col-11">
              <div
                className="p-0 p-md-5 text-center"
                style={{
                  background: "linear-gradient(180deg, #131030, #2F2267)",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                }}
              >
                <h2 className="text-white mb-3">Upload Your Voice File</h2>

                {/* Upload Logo */}
                <div
                  className="d-flex justify-content-center align-items-center mx-auto mb-3"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                  }}
                >
                  <MdOutlineFileUpload size={38} color="#fff" />
                </div>

                <p className="text-light mb-4" style={{ opacity: 0.8 }}>
                  Upload an audio file to personalize your voice experience
                </p>

                {/* Input Group */}
                <div className="input-group mb-3">
                  <input
                    type="file"
                    accept="audio/*"
                    className="form-control bg-dark text-white border-secondary"
                    onChange={handleFileChange}
                    style={{
                      borderRadius: "12px 0 0 12px",
                    }}
                  />
                  <span
                    className="input-group-text text-white"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      border: "none",
                      borderRadius: "0 12px 12px 0",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    <MdOutlineFileUpload />
                  </span>
                </div>

                {audioFile && (
                  <p className="text-success small mb-2">
                    Selected: {audioFile.name}
                  </p>
                )}
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <button
                  className="btn btn-custom w-100 mt-3"
                  disabled={uploading}
                  onClick={handleUpload}
                >
                  {uploading ? "Uploading..." : "Upload Voice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default AddVoice;
