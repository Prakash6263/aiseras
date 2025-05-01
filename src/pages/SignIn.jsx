import React, { useState } from "react";
import { loginUser } from "../utils/authApi";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";

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

        if (!formData.email || !formData.password) {
            setError("Email and Password are required");
            setLoading(false);
            return;
        }

        try {
            const res = await loginUser(formData);
            if (res.message === "User Logged in Sucessfully") {
                Cookies.set("auth_token", res.token, { expires: 1 });
                navigate("/face-recognition");
            } else {
                setError(res.message || "Login failed. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        }

        setLoading(false); // Stop Loader
    };

    return (
        <div className="login-30 tab-box">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-7 col-md-12 form-section">
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

                                    <button className="btn btn-custom mb-3" type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm"></span> Signing In...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    <p className="text-center mb-3 text-white">
                                        Don't have an account? <Link to="/signup">Sign Up</Link>
                                    </p>

                                    <p className="text-center mb-3 text-white">Or continue with</p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-social" disabled={loading}>
                                            <img src={img1} alt="Google" /> Google
                                        </button>
                                        <button className="btn btn-social" disabled={loading}>
                                            <img src={img2} alt="Facebook" /> Facebook
                                        </button>
                                    </div>

                                    <p className="text-center mt-3">
                                        By signing in, you agree to our{" "}
                                        <a href="#" className="text-primary">
                                            Terms and Conditions
                                        </a>
                                    </p>
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
