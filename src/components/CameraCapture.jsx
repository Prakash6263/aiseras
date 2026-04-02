import { useRef, useState, useEffect } from "react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setCameraActive(true);
        }
      } catch (err) {
        setError("Unable to access camera. Please check permissions.");
        console.error("[v0] Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo from video stream
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      setCapturedImage(imageData);
      setCameraActive(false);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  // Confirm and send captured image
  const handleConfirm = () => {
    if (capturedImage) {
      // Convert data URL to Blob
      fetch(capturedImage)
        .then((res) => res.blob())
        .then((blob) => {
          // Create a File object from Blob
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onCapture(file);
          onClose();
        })
        .catch((err) => {
          setError("Failed to process image");
          console.error("[v0] Image processing error:", err);
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-white text-xl font-bold mb-4">Capture Your Face</h2>

        {error && <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">{error}</div>}

        {cameraActive && !capturedImage && (
          <div className="mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full bg-black rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        )}

        {capturedImage && (
          <div className="mb-4">
            <img src={capturedImage} alt="Captured" className="w-full rounded" />
          </div>
        )}

        {/* Hidden canvas for capturing from video */}
        <canvas ref={canvasRef} width={640} height={480} style={{ display: "none" }} />

        <div className="flex gap-3 justify-center">
          {cameraActive && !capturedImage && (
            <>
              <button
                onClick={handleCapture}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Capture Photo
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Cancel
              </button>
            </>
          )}

          {capturedImage && (
            <>
              <button
                onClick={handleRetake}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Retake
              </button>
              <button
                onClick={handleConfirm}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Confirm
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
