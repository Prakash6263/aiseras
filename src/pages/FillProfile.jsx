import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { completeProfileData } from "../utils/authApi";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";

const FillProfile = () => {
  const navigate = useNavigate();
  const userEmail = Cookies.get("user_email");

  useEffect(() => {
    if (!userEmail) {
      navigate("/signup");
    }
  }, [userEmail, navigate]);

  const [formData, setFormData] = useState({
    email: userEmail || "",
    fullname: "",
    age: "",
    gender: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.email ||
      !formData.fullname ||
      !formData.age ||
      !formData.gender ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await completeProfileData(formData);
      console.log(res.data);
      Cookies.set("user", JSON.stringify(res.data), { expires: 7 });
      navigate("/");
      setFormData({
        email: userEmail,
        fullname: "",
        age: "",
        gender: "",
        password: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-30 tab-box">
        <div className="container-fluid">
          <div className="row">
            <div
              className="col-lg-5 col-md-12 bg-img"
            ></div>
            <div className="col-lg-7 col-md-12 form-section">
              <div className="login-inner-form">
                <div className="details">
                  <h1 className="mb-3">ENTER DETAILS</h1>
                  <p className="mb-5 text-white">Setup of user profile</p>

                  {error && <p className="alert alert-danger">{error}</p>}
                  {success && <p className="alert alert-success">{success}</p>}

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        name="fullname"
                        className="form-control"
                        placeholder="Fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        name="age"
                        className="form-control"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        name="gender"
                        className="form-control"
                        placeholder="Gender"
                        value={formData.gender}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <button className="btn btn-custom mb-3" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </form>

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

export default FillProfile;
