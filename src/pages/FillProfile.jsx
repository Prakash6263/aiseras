import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";
import { completeUserProfile } from "../utils/authApi";
import swal from "sweetalert";

const FillProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
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
    setLoading(true);

   const user_id =
  location.state?.user_id || JSON.parse(localStorage.getItem("user"))?.id;
    console.log("User ID from location state:", user_id);

    if (!user_id) {
      setError("User ID not found. Please start from email verification.");
      setLoading(false);
      return;
    }

    const { fullname, age, gender, password } = formData;

    if (!fullname || !age || !gender || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.append("user_id", user_id);
      payload.append("full_name", fullname);
      payload.append("age", age);
      payload.append("gender", gender);
      payload.append("password", password);

      const data = await completeUserProfile(payload);

      if (data.status === 1) {
        swal("Success", data.message, "success").then(() => {
          navigate("/signin");
        });
      } else {
        swal("Error", data.message || "Profile submission failed", "error");
      }
    } catch (err) {
      swal(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error",
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
                  {/* <p className="text-center mb-3 text-white">
                    Or continue with
                  </p>
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <button className="btn btn-social w-100 d-flex align-items-center justify-content-center gap-2">
                        <img src={img1} alt="Google" style={{ width: 18 }} />
                        Google
                      </button>
                    </div>

                    <div className="col-12 col-md-6">
                      <button className="btn btn-social w-100 d-flex align-items-center justify-content-center gap-2">
                        <img src={img2} alt="Facebook" style={{ width: 18 }} />
                        Facebook
                      </button>
                    </div>
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

export default FillProfile;
