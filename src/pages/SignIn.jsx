"use client";

import { useState } from "react";
import { loginUser } from "../utils/authApi";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";
import swal from "sweetalert";
import { FaArrowAltCircleLeft } from "react-icons/fa";
const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setError("Both fields are required.");
      setLoading(false);
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.append("email", email);
      payload.append("password", password);

      const data = await loginUser(payload);

      if (data.status === 1) {
        // Save user data and static token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", String(data?.user?.id ?? ""));

        swal("Success", data.message, "success").then(() => {
          navigate("/landing");
        });
      } else {
        swal("Error", data.message || "Login failed", "error");
      }
    } catch (err) {
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
    <div className="login-30 tab-box">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-7 col-md-12 form-section">
            <h1
              onClick={() => navigate("/")}
              className="fixed top-4 left-4 z-50 flex items-center gap-1 text-sm text-white font-medium cursor-pointer hover:opacity-80"
            >
              <FaArrowAltCircleLeft size={30} />
            </h1>

            <div className="login-inner-form">
              <div className="details">
                <h1>SIGN IN</h1>
                <h5 className="text-white mb-4">Welcome back</h5>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading} // Disable input while loading
                    />
                  </div>

                  {error && <p className="text-danger">{error}</p>}

                  <button
                    className="btn btn-custom mb-3"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm"></span>{" "}
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <p className="text-center mb-3 text-white">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
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
                  </div>

                  <p className="text-center mt-3">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-primary">
                      Terms and Conditions
                    </a>
                  </p> */}
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-12 bg-img"></div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
