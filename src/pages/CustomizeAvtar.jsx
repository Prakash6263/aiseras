import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadUserImage, createUserAvatar } from "../utils/mediaApi";

// 🔹 Dummy images
import cartoonDummy from "../assets/images/select1.png";
import cloneDummy from "../assets/images/select2.png";
import imageDummy from "../assets/images/select3.png";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
import CameraCapture from "../components/CameraCapture";

// Avatar types + mapping to API style
const avatarTypes = [
  {
    key: "cartoon",
    label: "Cartoon Avatar",
    dummy: cartoonDummy,
    style: "cartoon",
  },
  { key: "clone", label: "Clone Avatar", dummy: cloneDummy, style: "clone" },
  { key: "image", label: "Image Avatar", dummy: imageDummy, style: "original" },
];

export default function CustomizeAvatar() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  const [previewMap, setPreviewMap] = useState(() =>
    avatarTypes.reduce((acc, item) => {
      acc[item.key] = item.dummy;
      return acc;
    }, {}),
  );

  // 🔹 Avatar card click
  function handleAvatarClick(type) {
    if (loading) return;
    setSelectedType(type);
    // 🔹 Clone Avatar uses camera, others use file upload
    if (type === "clone") {
      setShowCamera(true);
    } else {
      fileInputRef.current.click();
    }
  }

  // 🔹 Handle camera capture — called after user confirms photo in CameraCapture modal
  // Camera JPEGs are routinely 1–3 MB so we raise the limit to 5 MB here.
  // We also auto-trigger avatar creation immediately so the user does not need
  // to press "Create Avatar" manually after capturing.
  function handleCameraCapture(capturedFile) {
    if (!capturedFile || !selectedType) return;
    if (capturedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB. Please retake the photo.");
      return;
    }
    setFile(capturedFile);
    setPreviewMap((prev) => ({
      ...prev,
      [selectedType]: URL.createObjectURL(capturedFile),
    }));
    setError("");
    // Auto-submit: start avatar creation immediately after photo is confirmed
    triggerCreateAvatar(capturedFile);
  }

  // 🔹 Core avatar creation — accepts an explicit fileArg so it can be called
  // immediately from handleCameraCapture without waiting for setFile() to settle.
  async function triggerCreateAvatar(fileArg) {
    const targetFile = fileArg || file;
    if (!targetFile || !selectedType) return;

    try {
      setLoading(true);
      setError("");

      console.log("[v0] Uploading image, size:", targetFile.size, "type:", targetFile.type);
      const uploadRes = await uploadUserImage(targetFile);
      console.log("[v0] uploadUserImage response:", uploadRes);
      if (!uploadRes?.success) throw new Error(uploadRes?.message || "Upload failed");

      const selectedAvatar = avatarTypes.find((a) => a.key === selectedType);
      const style = selectedAvatar?.style || "original";

      const createRes = await createUserAvatar(uploadRes.image_url, {
        style,
        name: `${selectedAvatar.label} - My Avatar`,
        description: `Avatar created in ${style} style`,
      });
      console.log("[v0] createUserAvatar response:", createRes);
      if (!createRes?.success) throw new Error(createRes?.message || "Avatar creation failed");

      localStorage.setItem("createdAvatarImageUrl", createRes.image_url);
      localStorage.setItem("createdAvatarId", createRes.avatar_id);

      setLoading(false);
      navigate("/SelectOption", {
        state: {
          imageUrl: createRes.image_url,
          avatarId: createRes.avatar_id,
          type: selectedType,
        },
      });
    } catch (err) {
      console.log("[v0] Avatar creation error:", err?.response?.data || err.message);
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err.message ||
        "Network error. Please try again."
      );
      setLoading(false);
    }
  }

  // 🔹 File change
  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f || !selectedType) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB");
      return;
    }
    setFile(f);
    setPreviewMap((prev) => ({
      ...prev,
      [selectedType]: URL.createObjectURL(f),
    }));
  }

  // 🔹 "Create Avatar" button handler — delegates to shared triggerCreateAvatar
  function handleCreateAvatar() {
    triggerCreateAvatar(null);
  }

  return (
    <div>
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
      <Header1 />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        {/* 🔹 SQUARE OUTER CONTAINER */}
        <div
          style={{
            width: "95%",
            maxWidth: 390,
            height: 400,
            background: "rgba(0,0,0)",
            backdropFilter: "blur(12px)",
            borderRadius: 20,
            padding: 16,
            marginTop: 115,
            color: "#fff",
            boxShadow: "0 25px 70px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => navigate("/landing")}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 20,
              color: "#fff",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.boxShadow = "0 0 12px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.boxShadow = "none";
            }}
            title="Close"
          >
            ✕
          </button>

          {/* Title */}
          <div>
            <p style={{ textAlign: "center", fontSize: 22 }}>
              Select Avatar Type
            </p>
          </div>

          {/* 🔹 Avatar Cards */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              width: "100%",
            }}
          >
            {avatarTypes.map((item) => (
              <div
                key={item.key}
                onClick={() => handleAvatarClick(item.key)}
                style={{
                  flex: 1, // 👈 outer container ke sath scale
                  maxWidth: "32%", // 3 cards fit nicely
                  cursor: loading ? "not-allowed" : "pointer",
                  textAlign: "center",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {/* Image box */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1", // 👈 auto height (square)
                    borderRadius: 10,
                    overflow: "hidden",
                    border:
                      selectedType === item.key
                        ? "2px solid #ffcc00"
                        : "1.5px solid rgba(255,255,255,0.25)",
                    boxShadow:
                      selectedType === item.key
                        ? "0 0 18px rgba(255,204,0,0.6)"
                        : "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  <img
                    src={previewMap[item.key]}
                    alt={item.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Label */}
                <div
                  style={{
                    marginTop: 6,
                    fontSize: "clamp(11px, 2.5vw, 14px)", // 👈 responsive text
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Hidden file input for Cartoon & Image Avatar */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Hidden camera input for Clone Avatar */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleCreateAvatar}
              disabled={!file || loading}
              style={{
                padding: "12px 50px",
                marginTop: 20,
                borderRadius: 22,
                background: "linear-gradient(90deg, #8e2de2 0%, #4a00e0 100%)",
                border: "none",
                fontWeight: 600,
                fontSize: 14,
                color: "#fff",
                cursor: !file || loading ? "not-allowed" : "pointer",
                opacity: !file || loading ? 0.6 : 1,
                position: "relative",
              }}
            >
              {loading && (
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #fff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 1s linear infinite",
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
              {loading ? "Creating Avatar..." : "Create Avatar"}
            </button>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <p
                style={{
                  color: "#ff9c9c",
                  fontSize: 13,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {error}
              </p>
              <button
                onClick={handleCreateAvatar}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.3s ease",
                }}
              >
                Retry
              </button>
            </div>
          )}

          <style>
            {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
          </style>
        </div>
      </div>
      <Footer />
    </div>
  );
}
