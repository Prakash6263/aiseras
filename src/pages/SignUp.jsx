import React, { useState } from "react";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { registerWithEmail } from "../utils/authApi";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loader State
  const navigate = useNavigate();

  // Email Validation Function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);

      const data = await registerWithEmail(formData);

      if (data.status === 1) {
        swal("Success", data.message, "success").then(() => {
          navigate("/verify-email", { state: { email } });
        });
      } else {
        swal("Error", data.message || "Registration failed", "error");
      }
    } catch (err) {
      console.log(err, "error");
      swal(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-30 tab-box">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5 col-md-12 bg-img"></div>

            <div className="col-lg-7 col-md-12 form-section">
              <h1
                onClick={() => navigate("/")}
                className="fixed top-4 left-4 lg:left-[43%]  z-50 flex items-center gap-1 text-sm text-white font-medium cursor-pointer hover:opacity-80"
              >
                <FaArrowAltCircleLeft size={30} />
              </h1>
              <div className="login-inner-form">
                <div className="details">
                  <h1>SIGN UP</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label
                        htmlFor="email"
                        className="form-label float-start text-white mb-4"
                      >
                        Sign in with email address
                      </label>
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Yourname@gmail.com"
                        aria-label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} // Disable input while loading
                      />
                    </div>

                    {error && <p className="text-danger">{error}</p>}
                    {success && <p className="text-success">{success}</p>}

                    <button
                      className="btn btn-custom mb-3"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm"></span>{" "}
                          Signing Up...
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>

                    <p className="text-center mt-3 mb-3 text-white">
                      By registering you agree with our{" "}
                      <Link to="/signin" className="text-primary">
                        Login
                      </Link>
                    </p>

                    {/* <p className="text-center mb-3 text-white">
                      Or continue with
                    </p>
                    <div className="d-flex justify-content-between gap-3">
  <button
    className="btn btn-social d-flex align-items-center justify-content-center"
    disabled={loading}
  >
    <img src={img1} alt="Google" className="me-2" />
    Google
  </button>

  <button
    className="btn btn-social d-flex align-items-center justify-content-center"
    disabled={loading}
  >
    <img src={img2} alt="Facebook" className="me-2" />
    Facebook
  </button>
</div> */}


                    {/* <p className="text-center mt-3">
                      By registering you agree with our{" "}
                      <a href="#" className="text-primary">
                        Terms and Conditions
                      </a>
                    </p> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
