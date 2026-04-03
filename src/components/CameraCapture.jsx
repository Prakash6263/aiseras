import { useRef, useState, useEffect, useCallback } from "react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null); // ref avoids stale closure in cleanup
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Start camera ──────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Prefer the front-facing (selfie) camera for clone avatar
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // play() must be called explicitly — required on mobile Safari
        await videoRef.current.play();
        setCameraReady(true);
      }
    } catch (err) {
      let msg = "Unable to access camera. Please allow camera permission and try again.";
      if (err.name === "NotAllowedError") msg = "Camera permission denied. Please enable it in your browser settings.";
      if (err.name === "NotFoundError") msg = "No camera found on this device.";
      if (err.name === "NotReadableError") msg = "Camera is already in use by another app.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Stop camera ───────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  // Start on mount, stop on unmount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // ── Capture photo ─────────────────────────────────────────────────────────
  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopCamera(); // release camera while user reviews
  }

  // ── Retake ────────────────────────────────────────────────────────────────
  function handleRetake() {
    setCapturedImage(null);
    startCamera();
  }

  // ── Confirm & send file to parent ─────────────────────────────────────────
  async function handleConfirm() {
    if (!capturedImage) return;
    try {
      const res = await fetch(capturedImage);
      const blob = await res.blob();
      const file = new File([blob], "clone-capture.jpg", { type: "image/jpeg" });
      onCapture(file);
      onClose();
    } catch {
      setError("Failed to process the captured image. Please try again.");
    }
  }

  // ── Inline styles (no Tailwind dependency for the overlay) ───────────────
  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 16,
  };

  const card = {
    background: "#0e0e0e",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 520,
    color: "#fff",
    position: "relative",
    boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
  };

  const btnBase = {
    border: "none",
    borderRadius: 24,
    padding: "10px 28px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "opacity 0.2s",
  };

  return (
    <div style={overlay}>
      <div style={card}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
            {capturedImage ? "Review Photo" : "Capture Your Face"}
          </h2>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: 34,
              height: 34,
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
            }}
            aria-label="Close camera"
          >
            ✕
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#7f1d1d",
            border: "1px solid #dc2626",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            lineHeight: 1.5,
          }}>
            {error}
            <button
              onClick={() => { setError(""); startCamera(); }}
              style={{ ...btnBase, background: "#dc2626", color: "#fff", marginTop: 10, display: "block", padding: "6px 18px" }}
            >
              Retry Camera
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {loading && !error && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
            <div style={{
              width: 40, height: 40, border: "3px solid #444", borderTop: "3px solid #a855f7",
              borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 12px",
            }} />
            <p style={{ margin: 0, fontSize: 14 }}>Starting camera…</p>
          </div>
        )}

        {/* Live video preview */}
        {!capturedImage && !loading && !error && (
          <div style={{ marginBottom: 20, position: "relative" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                borderRadius: 10,
                background: "#000",
                display: cameraReady ? "block" : "none",
                maxHeight: 360,
                objectFit: "cover",
                transform: "scaleX(-1)", // mirror effect for selfie cam
              }}
            />
            {/* Overlay guide */}
            {cameraReady && (
              <div style={{
                position: "absolute",
                inset: 0,
                border: "2px dashed rgba(168,85,247,0.5)",
                borderRadius: 10,
                pointerEvents: "none",
              }} />
            )}
          </div>
        )}

        {/* Captured image preview */}
        {capturedImage && (
          <div style={{ marginBottom: 20 }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", borderRadius: 10, display: "block", transform: "scaleX(-1)" }}
            />
          </div>
        )}

        {/* Hidden canvas */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Live view actions */}
          {!capturedImage && !loading && cameraReady && (
            <>
              <button
                onClick={handleCapture}
                style={{ ...btnBase, background: "linear-gradient(90deg,#8e2de2,#4a00e0)", color: "#fff", minWidth: 140 }}
              >
                Capture Photo
              </button>
              <button
                onClick={() => { stopCamera(); onClose(); }}
                style={{ ...btnBase, background: "rgba(255,255,255,0.08)", color: "#ccc" }}
              >
                Cancel
              </button>
            </>
          )}

          {/* Post-capture actions */}
          {capturedImage && (
            <>
              <button
                onClick={handleRetake}
                style={{ ...btnBase, background: "#92400e", color: "#fff" }}
              >
                Retake
              </button>
              <button
                onClick={handleConfirm}
                style={{ ...btnBase, background: "linear-gradient(90deg,#8e2de2,#4a00e0)", color: "#fff", minWidth: 140 }}
              >
                Use This Photo
              </button>
            </>
          )}
        </div>

        <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  );
}
