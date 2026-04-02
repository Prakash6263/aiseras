import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";
import { verifyEmailOTP } from "../utils/authApi";

const VerificationMail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationData, setVerificationData] = useState({
    email: "",
    code: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    if (location.state?.email) {
      setVerificationData((prev) => ({ ...prev, email: location.state.email }));
    }
    setPageLoading(false);
  }, []);


  const verificationCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { email, code } = verificationData;

    if (!email || !code) {
      setMessage("Email and OTP are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("otp", code);

      const data = await verifyEmailOTP(formData);

      if (data.status === 1) {
        swal("Success", data.message, "success").then(() => {
          navigate("/profile", { state: { user_id: data.user_id } });
        });      
      } else {
        swal("Error", data.message || "Verification failed", "error");
      }
    } catch (err) {
      swal("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
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
                  {/* <p className="text-center mb-3 text-white">
                    Or continue with
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-social flex justify-center items-center">
                      <img src={img1} alt="Google" /> Google
                    </button>
                    <button className="btn btn-social flex justify-center items-center">
                      <img src={img2} alt="Facebook" /> Facebook
                    </button>
                  </div>
                  <p className="text-center mt-3">
                    By registering, you agree to our{" "}
                    <a href="#" className="text-primary">
                      Terms and Conditions
                    </a>
                  </p> */}
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
