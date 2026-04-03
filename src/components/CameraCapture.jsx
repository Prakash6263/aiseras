import { useRef, useState, useEffect, useCallback } from "react";

/**
 * CameraCapture
 * Works on Android Chrome, iOS Safari, desktop Chrome/Firefox/Edge.
 *
 * Key design decisions that make mobile work:
 *  - The <video> element is ALWAYS in the DOM once the stream is assigned.
 *    Hiding it with display:none while it is trying to play breaks Android.
 *  - We NEVER call video.play() manually. The browser plays automatically
 *    because the element has autoPlay + playsInline + muted attributes.
 *  - We use the onCanPlay event on the video element to flip cameraReady.
 *  - streamRef (not state) stores the MediaStream so cleanup is never stale.
 */
export default function CameraCapture({ onCapture, onClose }) {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);

  const [phase, setPhase]             = useState("starting"); // starting | live | captured | error
  const [capturedImage, setCapturedImage] = useState(null);
  const [errorMsg, setErrorMsg]       = useState("");

  // ── Stop all tracks ────────────────────────────────────────────────────────
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // ── Start camera ───────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setPhase("starting");
    setErrorMsg("");
    setCapturedImage(null);

    // Stop any previous stream
    stopStream();

    // Check API availability
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMsg("Your browser does not support camera access. Please use Chrome or Safari.");
      setPhase("error");
      return;
    }

    let stream;

    // Attempt 1: front-facing camera with resolution hints
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
    } catch {
      // Attempt 2: any camera, no constraints (works on most Android devices)
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (err2) {
        let msg = "Unable to access camera. Please allow camera permission.";
        if (err2.name === "NotAllowedError" || err2.name === "PermissionDeniedError")
          msg = "Camera permission denied. Enable it in browser settings and reload.";
        else if (err2.name === "NotFoundError" || err2.name === "DevicesNotFoundError")
          msg = "No camera found on this device.";
        else if (err2.name === "NotReadableError" || err2.name === "TrackStartError")
          msg = "Camera is in use by another app. Close it and try again.";
        setErrorMsg(msg);
        setPhase("error");
        return;
      }
    }

    streamRef.current = stream;

    // Assign to video element.
    // IMPORTANT: the <video> must already be mounted. We rely on autoPlay+playsInline+muted
    // for the browser to start playing — we do NOT call .play() ourselves.
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      // Older iOS / WebView needs load() when srcObject is set dynamically
      try { video.load(); } catch {}
    }
  }, [stopStream]);

  // Start on mount, stop on unmount
  useEffect(() => {
    startCamera();
    return () => stopStream();
  }, [startCamera, stopStream]);

  // ── Video event: canplay fires when the browser can render the first frame ──
  function handleCanPlay() {
    // On some browsers canplay fires before srcObject is truly rendering.
    // Calling play() here is safe because it is inside a user-trusted event
    // chain AND the element already has autoPlay — this is just a safety net.
    videoRef.current?.play().catch(() => {});
    setPhase("live");
  }

  // ── Capture photo ──────────────────────────────────────────────────────────
  function handleCapture() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Scale down to max 720px wide to keep file size under ~400 KB
    const MAX_W = 720;
    const srcW  = video.videoWidth  || 640;
    const srcH  = video.videoHeight || 480;
    const ratio = Math.min(1, MAX_W / srcW);
    canvas.width  = Math.round(srcW * ratio);
    canvas.height = Math.round(srcH * ratio);

    const ctx = canvas.getContext("2d");
    // Mirror horizontally to match the selfie preview
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // quality 0.82 → typical output ~150–350 KB, well within upload limits
    const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
    setCapturedImage(dataUrl);
    stopStream();
    setPhase("captured");
  }

  // ── Retake ─────────────────────────────────────────────────────────────────
  function handleRetake() {
    startCamera();
  }

  // ── Confirm & pass file to parent ──────────────────────────────────────────
  async function handleConfirm() {
    if (!capturedImage) return;
    try {
      const res  = await fetch(capturedImage);
      const blob = await res.blob();
      const file = new File([blob], "clone-capture.jpg", { type: "image/jpeg" });
      onCapture(file);
      onClose();
    } catch {
      setErrorMsg("Failed to process image. Please try again.");
    }
  }

  // ── Close ──────────────────────────────────────────────────────────────────
  function handleClose() {
    stopStream();
    onClose();
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const S = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.92)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    card: {
      background: "#111",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 18,
      padding: "20px 20px 24px",
      width: "100%",
      maxWidth: 480,
      color: "#fff",
      position: "relative",
      boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: { margin: 0, fontSize: 17, fontWeight: 700 },
    closeBtn: {
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "50%",
      width: 34, height: 34,
      color: "#fff",
      fontSize: 17,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    videoWrap: {
      position: "relative",
      marginBottom: 16,
      borderRadius: 10,
      overflow: "hidden",
      background: "#000",
      // Fixed height prevents layout collapse while camera initialises
      minHeight: 200,
    },
    video: {
      width: "100%",
      display: "block",
      maxHeight: 340,
      objectFit: "cover",
      transform: "scaleX(-1)", // mirror selfie camera
      background: "#000",
    },
    spinner: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",
      gap: 10,
    },
    spinnerRing: {
      width: 36, height: 36,
      border: "3px solid #333",
      borderTop: "3px solid #a855f7",
      borderRadius: "50%",
      animation: "cc-spin 0.85s linear infinite",
    },
    guideFrame: {
      position: "absolute",
      inset: 0,
      border: "2px dashed rgba(168,85,247,0.45)",
      borderRadius: 10,
      pointerEvents: "none",
    },
    errorBox: {
      background: "#450a0a",
      border: "1px solid #dc2626",
      borderRadius: 8,
      padding: "10px 14px",
      marginBottom: 14,
      fontSize: 13,
      lineHeight: 1.5,
    },
    actions: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: 4,
    },
    btnPrimary: {
      background: "linear-gradient(90deg,#8e2de2,#4a00e0)",
      color: "#fff",
      border: "none",
      borderRadius: 24,
      padding: "10px 28px",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      minWidth: 130,
    },
    btnSecondary: {
      background: "rgba(255,255,255,0.08)",
      color: "#ccc",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 24,
      padding: "10px 22px",
      fontWeight: 500,
      fontSize: 14,
      cursor: "pointer",
    },
    btnDanger: {
      background: "#7f1d1d",
      color: "#fff",
      border: "none",
      borderRadius: 24,
      padding: "10px 22px",
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
    },
  };

  const isStarting = phase === "starting";
  const isLive     = phase === "live";
  const isCaptured = phase === "captured";
  const isError    = phase === "error";

  return (
    <div style={S.overlay}>
      <div style={S.card}>

        {/* Header */}
        <div style={S.header}>
          <h2 style={S.title}>
            {isCaptured ? "Review Photo" : "Capture Your Face"}
          </h2>
          <button style={S.closeBtn} onClick={handleClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Error state */}
        {isError && (
          <div style={S.errorBox}>
            <p style={{ margin: "0 0 10px" }}>{errorMsg}</p>
            <button
              style={{ ...S.btnPrimary, minWidth: "auto", padding: "7px 18px", fontSize: 13 }}
              onClick={() => startCamera()}
            >
              Retry Camera
            </button>
          </div>
        )}

        {/* Camera / preview area */}
        {!isCaptured && !isError && (
          <div style={S.videoWrap}>
            {/* Spinner — shown while camera is starting */}
            {isStarting && (
              <div style={S.spinner}>
                <div style={S.spinnerRing} />
                <span style={{ color: "#aaa", fontSize: 13 }}>Starting camera…</span>
              </div>
            )}

            {/*
              The video element is ALWAYS present in the DOM once we're not in error/captured.
              It is invisible (opacity 0) while starting, visible when live.
              NEVER use display:none here — it prevents Android from initialising the stream.
            */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onCanPlay={handleCanPlay}
              style={{
                ...S.video,
                opacity: isLive ? 1 : 0,
                transition: "opacity 0.3s",
              }}
            />

            {/* Guide overlay — only when live */}
            {isLive && <div style={S.guideFrame} />}
          </div>
        )}

        {/* Captured image preview */}
        {isCaptured && capturedImage && (
          <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden" }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Action buttons */}
        <div style={S.actions}>

          {/* While camera is starting — show disabled capture button so layout doesn't jump */}
          {isStarting && (
            <button style={{ ...S.btnPrimary, opacity: 0.45, cursor: "not-allowed" }} disabled>
              Capture Photo
            </button>
          )}

          {/* Live — ready to capture */}
          {isLive && (
            <>
              <button style={S.btnPrimary} onClick={handleCapture}>
                Capture Photo
              </button>
              <button style={S.btnSecondary} onClick={handleClose}>
                Cancel
              </button>
            </>
          )}

          {/* Review captured photo */}
          {isCaptured && (
            <>
              <button style={S.btnDanger} onClick={handleRetake}>
                Retake
              </button>
              <button style={S.btnPrimary} onClick={handleConfirm}>
                Use This Photo
              </button>
            </>
          )}

          {/* Error — cancel */}
          {isError && (
            <button style={S.btnSecondary} onClick={handleClose}>
              Cancel
            </button>
          )}
        </div>

        <style>{`
          @keyframes cc-spin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
