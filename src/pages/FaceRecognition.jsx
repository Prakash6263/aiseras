import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import img1 from "../assets/images/frame.png";
import Camera from "../assets/images/camera.png";
import image2 from "../assets/images/image2.png";
import image from "../assets/images/image.png";
import logo from "../assets/assets/img/logo/logo.png";
import { uploadFaceImage, captureFace } from "../utils/authApi";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

const FaceRecognition = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);
  const [emotionData, setEmotionData] = useState(null);
  const [hasContinued, setHasContinued] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
    setUploading(true);
    setApiResponse(null);

    try {
      let data;

      if (isLive) {
        const canvas = canvasRef.current;
        const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
        data = await captureFace(base64);
      } else {
        const file = fileInputRef.current.files[0];
        if (!file) throw new Error("No file selected");
        data = await uploadFaceImage(file);
      }

      setEmotionData(data);
      setApiResponse(data);
      setHasContinued(true);

      navigate("/result", {
        state: {
          dominantEmotion: data.dominant_emotion,
        },
      });
    } catch (err) {
      console.error("Continue failed:", err);
      setApiResponse({ error: "Failed to process image." });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setTimeout(() => {
              handleCapture(); // Auto-capture
            }, 1000);
          };
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  }, []);

  const handleCapture = () => {
    setIsLive(true);
    setUploadedImageURL(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!video || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setShowCanvas(true);
    setShowButtons(true);
  };

  const handleUpload = async () => {
    if (error) return; // ⛔ safety guard

    setUploading(true);
    setApiResponse(null);

    if (isLive) {
      // CAMERA FLOW
      try {
        const canvas = canvasRef.current;
        const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
        const data = await captureFace(base64);
        setEmotionData(data);
        setApiResponse(data);
      } catch (err) {
        console.error("Live capture failed:", err);
        setApiResponse({ error: "Live capture failed" });
      } finally {
        setUploading(false);
      }
    } else {
      // FILE UPLOAD FLOW
      try {
        const file = fileInputRef.current?.files[0];
        if (!file) throw new Error("No file selected");

        const data = await uploadFaceImage(file);
        setEmotionData(data);
        setApiResponse(data);
      } catch (err) {
        console.error("File upload failed:", err);
        setApiResponse({ error: "File upload failed" });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    // ❌ no file selected
    if (!file) {
      setError("Please upload an image");
      return; // ✅ IMPORTANT
    }

    // ❌ TYPE CHECK
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      e.target.value = "";
      return;
    }

    // ❌ SIZE CHECK
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 1 MB");
      setUploadedImageURL(null);
      e.target.value = "";
      return;
    }

    // ✅ VALID FILE
    setError("");
    setUploading(true);
    setApiResponse(null);
    setIsLive(false);

    try {
      const previewURL = URL.createObjectURL(file);
      setUploadedImageURL(previewURL);

      const data = await uploadFaceImage(file);
      setEmotionData(data);
      setApiResponse(data);

      setShowCanvas(false);
      setShowButtons(true);
    } catch (err) {
      console.error("Upload failed:", err);
      setApiResponse({ error: "Upload failed" });
      setError("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRecapture = () => {
    setUploadedImageURL(null);
    setShowCanvas(false);
    setShowButtons(false);
    setApiResponse(null);
    setEmotionData(null);
    setHasContinued(false);
    setTimeout(() => {
      handleCapture();
    }, 500);
  };

  const handleRemove = () => {
    setShowCanvas(false);
    setShowButtons(false);
    setApiResponse(null);
  };

  const zoomIn = () => {
    const zoomSlider = document.getElementById("zoomSlider");
    if (zoomSlider) {
      let currentValue = parseInt(zoomSlider.value, 10);
      zoomSlider.value = Math.min(currentValue + 10, 100);
    }
  };

  const zoomOut = () => {
    const zoomSlider = document.getElementById("zoomSlider");
    if (zoomSlider) {
      let currentValue = parseInt(zoomSlider.value, 10);
      zoomSlider.value = Math.max(currentValue - 10, 1);
    }
  };

  const handleZoomChange = (e) => {
    const zoomValue = e.target.value;
    const video = videoRef.current;
    if (video) {
      video.style.transform = `scale(${zoomValue / 50})`;
    }
  };

  return (
    <>
      <Header1 />

      <style
        dangerouslySetInnerHTML={{
          __html:
            '\n         .camera-container {\n            position: relative;\n            width: 250px;\n            height: 250px;\n        }\n        video, canvas {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n        .frame-overlay {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            pointer-events: none;\n        }\n        .buttons {\n            margin-top: 20px;\n            display: none;\n             background-color: #333333;\n             width: 280px;\n             border-radius: 10px;\n        }\n        button {\n            padding: 10px 20px;\n            margin: 5px;\n            cursor: pointer;\n            border: none;\n            background-color: #333333;\n            color: white;\n            border-radius: 5px;\n        }\n\n        .step-progress {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      padding: 60px 10px;\n      gap: 0.5rem;\n    }\n\n    .step {\n      text-align: center;\n      color: #8891a7;\n    }\n\n    .circle {\n      width: 32px;\n      height: 32px;\n      border-radius: 50%;\n      background-color: #1d1f26;\n      border: 2px solid #8891a7;\n      color: white;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin: 0 auto 5px;\n      font-size: 13px;\n      font-weight: bold;\n    }\n\n    .step.completed .circle {\n      background-color: #8891a7;\n      color: white;\n    }\n\n    .step.completed .checkmark {\n      font-size: 14px;\n    }\n\n    .step.active .circle {\n      background-color: white;\n      color: #1d1f26;\n    }\n\n    .label {\n      font-size: 12px;\n      opacity: 0.6;\n    }\n\n    .line {\n      height: 2px;\n      width: 40px;\n      background-color: #8891a7;\n      opacity: 0.6;\n    }\n\n    .zoom-slider-container {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      height: 300px;\n      padding: 20px;\n    }\n\n    .zoom-icon {\n      color: white;\n      font-size: 14px;\n      cursor: pointer;\n      user-select: none;\n      padding: 4px;\n    }\n\n    input[type="range"] {\n      -webkit-appearance: none;\n       writing-mode: vertical-lr;\n      width: 5px;\n      height:350px;\n    \n      background: #222;\n    }\n\n    input[type="range"]::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      width: 16px;\n      height: 16px;\n      border-radius: 50%;\n      background: magenta;\n      border: 2px solid white;\n      cursor: pointer;\n      margin-top: -6px;\n    }\n\n    input[type="range"]::-webkit-slider-runnable-track {\n      width: 100%;\n      height: 4px;\n      background: #ccc;\n    }\n\n    /* Firefox */\n    input[type="range"]::-moz-range-thumb {\n      width: 10px;\n      height: 10px;\n      border-radius: 50%;\n      background: magenta;\n      margin-left:-20px;\n      border: 2px solid white;\n      cursor: pointer;\n    }\n\n    input[type="range"]::-moz-range-track {\n      background: #ccc;\n      height: 4px;\n    }\n',
        }}
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      {/* About Here */}
      <section className="pt-120 pb-120 mt-5 mb-5">
        {/*Container*/}
        <div className="container">
          <div className="row align-items-center pt-80 justify-content-center">
            {/*about content*/}
            <div className="col-lg-8 text-center">
              <h2 className="text-white mb-5">Help Us Record Your Emotion</h2>
              <div
                className="d-flex pt-5 p-5 pb-5 mb-5 justify-content-between align-items-center"
                style={{ backgroundColor: "#222", borderRadius: 25 }}
              >
                <div
                  className="d-flex flex-column justify-content-between p-2"
                  style={{ height: 250, background: "#000" }}
                >
                  <div>
                    <div
                      onClick={() => window.location.reload()}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={Camera} alt="Capture" />
                    </div>
                  </div>
                  <div>
                    <a href="#">
                      <img src={`${`${image2}`}`} />
                    </a>
                  </div>
                  <div onClick={handleFileSelect} style={{ cursor: "pointer" }}>
                    <img src={image} alt="Upload" />
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <div className="camera-container text-center">
                  {isLive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        style={{ borderRadius: 10 }}
                      />
                      <canvas ref={canvasRef} style={{ display: "none" }} />
                    </>
                  ) : (
                    <img
                      src={uploadedImageURL}
                      alt="Uploaded preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <img
                    src={img1}
                    className="frame-overlay"
                    alt="Frame Overlay"
                  />
                </div>

                <div>
                  <div className="zoom-slider-container">
                    <div className="zoom-icon" onClick={zoomIn}>
                      +
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      defaultValue={50}
                      id="zoomSlider"
                      onChange={handleZoomChange}
                    />

                    <div className="zoom-icon" onClick={zoomOut}>
                      −
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-danger">{error}</p>}
              {/* <button
              id="capture"
              className="btn btn-custom mb-1 w-50"
             
              onClick={handleContinue}
            >
              Continue
            </button> */}
              <button
                // disabled={!!error || uploading}
                className="btn btn-custom mb-1 w-50"
                onClick={() => setShowConfirm(true)}
              >
                {uploading ? "Processing..." : "Continue"}
              </button>

              <center>
                <center>
                  {hasContinued && (
                    <>
                      <div className="buttons position-relative">
                        <button onClick={handleRemove}>
                          <i className="fa fa-trash" /> <br /> Remove
                        </button>
                        <button onClick={handleRecapture}>
                          <i className="fa fa-camera" /> <br /> Recapture
                        </button>
                        <button onClick={handleUpload}>
                          <i className="fa fa-upload" /> <br /> Upload
                        </button>
                      </div>

                      <button
                        className="btn btn-custom mt-3"
                        onClick={() =>
                          navigate("/nextpage", {
                            state: {
                              dominantEmotion: emotionData.dominant_emotion,
                            },
                          })
                        }
                      >
                        Final Confirm & Next
                      </button>
                    </>
                  )}
                </center>
              </center>
              <div className="step-progress">
                <div className="step active">
                  <div className="circle">
                    <span className="checkmark">✓</span>
                  </div>
                  <div className="label">Facial</div>
                </div>
                <div className="line" />
                <div className="step active">
                  <div className="circle">
                    <span className="checkmark">✓</span>
                  </div>
                  <div className="label">Happy</div>
                </div>
                <div className="line" />
                <div className="step">
                  <div className="circle">03</div>
                  <div className="label">Avatar</div>
                </div>
                <div className="line" />
                <div className="step">
                  <div className="circle">04</div>
                  <div className="label">Voice</div>
                </div>
                <div className="line" />
                <div className="step">
                  <div className="circle">05</div>
                  <div className="label">Thank You</div>
                </div>
              </div>
            </div>
            {/*about content*/}
          </div>
        </div>
        {showConfirm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              pointerEvents: "auto",
            }}
            onClick={() => setShowConfirm(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#191919",
                padding: "40px",
                borderRadius: "20px",
                maxWidth: "450px",
                width: "90%",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              }}
            >
              <h2 className="text-white mb-4">Face Recognition</h2>

              <p className="text-white mb-4" style={{ opacity: 0.85 }}>
                A dummy text generator is a tool that produces random text for
                use in design mockups and previews.
              </p>

              <button
                className="btn btn-custom w-75"
                onClick={() => {
                  setShowConfirm(false);
                  handleContinue();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/*Container*/}
      </section>
      {/* About End */}
      {/* The Modal */}

      {/* Footer Here */}
      {/* <footer className="footer__section footer__section__five">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__top">
              <div className="row g-5">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <div className="widget__head">
                      <a href="index.html" className="footer__logo">
                        <img
                          src={`${logo}`}
                          alt="logo"
                          style={{ width: 150 }}
                        />
                      </a>
                    </div>
                    <p className="pb__20">
                      Artificial Intelligence (AI) and Machine Learning (ML) are
                      closely related technologies that enable computers to
                      learn from data and make predictions
                    </p>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <div className="widget__head">
                      <h4>Explore</h4>
                    </div>
                    <div className="widget__link">
                      <a href="#" className="link">
                        Resources
                      </a>
                      <a href="#" className="link">
                        Blog
                      </a>
                      <a href="#" className="link">
                        Documents
                      </a>
                      <a href="#" className="link">
                        Help Center
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <div className="widget__head">
                      <h4>Menu</h4>
                    </div>
                    <div className="widget__link">
                      <a href="#" className="link">
                        Home
                      </a>
                      <a href="#" className="link">
                        About Us
                      </a>
                      <a href="#" className="link">
                        Services
                      </a>
                      <a href="#" className="link">
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <div className="widget__head">
                      <h4>Office Location</h4>
                    </div>
                    <div className="widget__link">
                      <a
                        href="javascript:void(0)"
                        className="footer__contact__items"
                      >
                        <span className="icon iconthree">
                          <span className="material-symbols-outlined">
                            pin_drop
                          </span>
                        </span>
                        <span className="fcontact__content">
                          Westheimer Rd. Santa Ana, Illinois
                        </span>
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="footer__contact__items"
                      >
                        <span className="icon">
                          <i className="material-symbols-outlined">add_call</i>
                        </span>
                        <span className="fcontact__content">
                          (XXX) XXX-XXXX
                        </span>
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="footer__contact__items"
                      >
                        <span className="icon icontwo">
                          <i className="material-symbols-outlined">
                            mark_as_unread
                          </i>
                        </span>
                        <span className="fcontact__content">
                          <span
                            className="__cf_email__"
                            data-cfemail="03667b626e736f6643667b626e736f662d606c6e"
                          >
                            [email&nbsp;protected]
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__bottom footer__bottom__two">
              <ul className="footer__bottom__link">
                <li>
                  <a href="support.html">Terms</a>
                </li>
                <li>
                  <a href="support.html">Privacy</a>
                </li>
                <li>
                  <a href="support.html">Cookies</a>
                </li>
              </ul>
              <p>© 2025 By Aiseras. All Rights Reserved.</p>
              <ul className="social">
                <li>
                  <a href="javascript:void(0)" className="social__item">
                    <span className="icon">
                      <img
                        src="/src/assets/assets/img/svg-icon/facebook.svg"
                        alt="svg"
                      />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="social__item social__itemtwo"
                  >
                    <span className="icon">
                      <img
                        src="/src/assets/assets/img/svg-icon/instagram.svg"
                        alt="svg"
                      />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="social__item social__itemthree"
                  >
                    <span className="icon">
                      <img
                        src="/src/assets/assets/img/svg-icon/twitter.svg"
                        alt="svg"
                      />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="social__item social__itemfour"
                  >
                    <span className="icon">
                      <img
                        src="/src/assets/assets/img/svg-icon/linkedin.svg"
                        alt="svg"
                      />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer> */}
      {/* Footer End */}
     <Footer/>
    </>
  );
};

export default FaceRecognition;
