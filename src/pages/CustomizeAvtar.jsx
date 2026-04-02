import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadUserImage, createUserAvatar } from "../utils/mediaApi";

// 🔹 Dummy images
import cartoonDummy from "../assets/images/select1.png";
import cloneDummy from "../assets/images/select2.png";
import imageDummy from "../assets/images/select3.png";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

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

  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    fileInputRef.current.click();
  }

  // 🔹 File change
  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f || !selectedType) return;
    if (f.size > 1 * 1024 * 1024) {
      setError("Image size must be less than 1 MB");
      return;
    }
    setFile(f);
    setPreviewMap((prev) => ({
      ...prev,
      [selectedType]: URL.createObjectURL(f),
    }));
  }

  // 🔹 Create avatar API call
  async function handleCreateAvatar() {
    if (!file || !selectedType) return;

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Upload image
      const uploadRes = await uploadUserImage(file);
      // console.log("uploadUserImage Error", uploadRes);
      if (!uploadRes?.success) throw new Error("Upload failed");

      // 2️⃣ Map selected type to API style
      const selectedAvatar = avatarTypes.find((a) => a.key === selectedType);
      const style = selectedAvatar?.style || "original";

      // 3️⃣ Create avatar
      const createRes = await createUserAvatar(uploadRes.image_url, {
        style,
        name: `${selectedAvatar.label} - My Avatar`,
        description: `Avatar created in ${style} style`,
      });
      // console.log("createUserAvatar img", createRes);
      localStorage.setItem("createdAvatarImageUrl", createRes.image_url);
      localStorage.setItem("createdAvatarId", createRes.avatar_id);

      if (!createRes?.success) throw new Error("Avatar creation failed");

      // 4️⃣ Navigate to final page
      navigate("/SelectOption", {
        state: {
          imageUrl: createRes.image_url,
          avatarId: createRes.avatar_id,
          type: selectedType,
        },
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
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
          }}
        >
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

          {/* Hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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
            <p
              style={{
                color: "#ff9c9c",
                fontSize: 13,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              {error}
            </p>
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
