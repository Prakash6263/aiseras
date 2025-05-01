import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verificationOtpEmail } from "../utils/authApi";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";
import Cookies from "js-cookie";

const VerificationMail = () => {
  const navigate = useNavigate();
  const email = Cookies.get("user_email") || "";

  const [verificationData, setVerificationData] = useState({
    email: email,
    code: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Redirect to signup if email is missing
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    } else {
      setPageLoading(false);
    }
  }, [email, navigate]);

  const verificationCheck = async () => {
    setMessage("");
    if (!verificationData.code) {
      setMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verificationOtpEmail(verificationData);
      if (res.success) {
        setMessage("Verification successful! Redirecting...");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        setMessage(res.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="page_loader">Loading...</div>;
  }

  return (
    <>
      <div className="page_loader" />
      <div className="login-30 test-verify tab-box">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-lg-5 col-md-12 bg-img"
            ></div>
            <div className="col-lg-7 col-md-12 form-section">
              <div className="login-inner-form">
                <div className="details">
                  <h1>VERIFY</h1>

                  <div className="form-group">
                    <label
                      htmlFor="verification_code"
                      className="form-label float-start text-white mb-4"
                    >
                      Enter the verification code sent to your email:
                    </label>
                    <input
                      name="code"
                      type="text"
                      className="form-control"
                      id="verification_code"
                      placeholder="Enter Verification Code"
                      value={verificationData.code}
                      onChange={(e) =>
                        setVerificationData({
                          ...verificationData,
                          code: e.target.value,
                        })
                      }
                    />
                  </div>

                  {message && (
                    <p
                      className={
                        message.includes("successful")
                          ? "text-success"
                          : "text-warning"
                      }
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="button"
                    className="btn btn-custom mb-3"
                    onClick={verificationCheck}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>

                  <hr />
                  <p className="text-center mb-3 text-white">
                    Or continue with
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-social">
                      <img src={img1} alt="Google" /> Google
                    </button>
                    <button className="btn btn-social">
                      <img src={img2} alt="Facebook" /> Facebook
                    </button>
                  </div>
                  <p className="text-center mt-3">
                    By registering, you agree to our{" "}
                    <a href="#" className="text-primary">
                      Terms and Conditions
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationMail;
