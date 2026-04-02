import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import img1 from "../assets/images/frame.png";
import { uploadFaceImage } from "../utils/authApi";

const FaceRecognition = () => {
  const navigate = useNavigate()
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [emotionData, setEmotionData] = useState(null)

  const handleContinue = () => {
    console.log(emotionData,"emotion")

    if (!emotionData) return;
    navigate("/nextpage", {
      state: {
        dominantEmotion: emotionData.dominant_emotion,
      },
    });
  };
  


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setShowCanvas(true);
    setShowButtons(true);
  };

  const handleUpload = async () => {
    const canvas = canvasRef.current;
    setUploading(true);
    setApiResponse(null);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      try {
        const res = uploadFaceImage(formData)
        const data = await res;
        setApiResponse(data);
        setEmotionData(data)
      } catch (err) {
        console.error("Upload failed:", err);
        setApiResponse({ error: "Upload failed" });
      } finally {
        setUploading(false);
      }
    }, "image/jpeg");
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploading(true);
    setApiResponse(null);
  
    try {
      const previewURL = URL.createObjectURL(file);
      setUploadedImageURL(previewURL);
      
      const data = await uploadFaceImage(file);
            console.log(data, "dataaa");
            setEmotionData(data)
      setApiResponse(data);
      setShowCanvas(false);
      setShowButtons(true);
    } catch (err) {
      console.error("Upload failed:", err);
      setApiResponse({ error: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };
  

  const handleRecapture = () => {
    setShowCanvas(false);
    setShowButtons(false);
    setApiResponse(null);
  };

  const handleRemove = () => {
    setShowCanvas(false);
    setShowButtons(false);
    setApiResponse(null);
  };

  return (
    <>
      <section className="header-section">
        <div className="header-testting-wrap">
          <Header />
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .camera-container {
            position: relative;
            width: 250px;
            height: 250px;
          }
          video, canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .frame-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }
          .buttons {
            margin-top: 20px;
          }
          button {
            padding: 10px 20px;
            margin: 5px;
            cursor: pointer;
            border: none;
            background-color: purple;
            color: white;
            border-radius: 5px;
          }
        `,
        }}
      />

      <section className="pt-120 pb-120 mt-5 mb-5">
        <div className="container">
          <div className="row align-items-center pt-80 justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="text-white mb-5">Help Us Record Your Emotion</h2>
              <div
                className="text-center pt-5 pb-5"
                style={{ backgroundColor: "#222", borderRadius: 25 }}
              >
                <center>
                <div className="camera-container text-center mb-5">
  {uploadedImageURL ? (
    <img
      src={uploadedImageURL}
      alt="Uploaded"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "10px",
      }}
    />
  ) : (
    <>
      <video
        ref={videoRef}
        autoPlay
        style={{
          display: showCanvas ? "none" : "block",
          borderRadius: "10px",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          display: showCanvas ? "block" : "none",
          borderRadius: "10px",
        }}
      />
    </>
  )}
  <img src={img1} className="frame-overlay" alt="Frame Overlay" />
</div>

                </center>

                {!showCanvas && (
                  <button
                    className="btn btn-custom mb-3 w-50"
                    data-bs-toggle="modal"
                    data-bs-target="#confirm"
                    onClick={handleCapture}
                  >
                    Continue
                  </button>
                )}

                {showButtons && (
                  <div className="buttons">
                    <button onClick={handleRecapture}>Recapture</button>
                    <button onClick={handleRemove}>Remove</button>
                    <button onClick={handleUpload} disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <button onClick={handleFileSelect} disabled={uploading}>
                      {uploading ? "Uploading..." : "Upload From Device"}
                    </button>
                  </div>
                )}

                {apiResponse && (
                  <div className="text-white mt-4">
                    <h5>API Response:</h5>
                    <pre className="text-white text-start">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="modal" id="confirm" style={{ top: "10%" }}>
        <div className="modal-dialog">
          <div
            className="modal-content"
            style={{ backgroundColor: "#191919", borderRadius: 25 }}
          >
            <div className="modal-body text-center p-5">
              <h2 className="text-white mb-5">Face Recognition</h2>
              <p className="text-white mb-5">
                A dummy text generator is a tool that produces random text for
                use in design mockups and content previews, mimicking the
                structure and format of readable content without having any
                meaningful information.
              </p>
              <button
  className="btn btn-custom mb-3 w-50"
  data-bs-dismiss="modal"
  onClick={handleContinue}
>
  Confirm
</button>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FaceRecognition;




