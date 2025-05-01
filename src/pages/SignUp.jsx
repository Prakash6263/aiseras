// import React, { useState } from "react";
// import img1 from "../assets/images/google.png";
// import img2 from "../assets/images/facebook.png";
// import {sendVerificationOtp} from "../utils/authApi";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   // Email Validation Function
//   const validateEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!email) {
//       setError("Email is required");
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     try {
//       const res = await sendVerificationOtp(email);
//       if (res.success) {
//         setSuccess("Verification email sent successfully!");
//         navigate("/verify-email", { state: { email } });
//       } else {
//         setError("Failed to send verification email");
//       }
//     } catch (error) {
//       setError("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <>
//       {/* <div className="page_loader" /> */}
//       {/* Login 30 start */}
//       <div className="login-30 tab-box">
//         <div className="container-fluid">
//           <div className="row">
//             <div className="col-lg-5 col-md-12 bg-img"></div>
//             <div className="col-lg-7 col-md-12 form-section">
//               <div className="login-inner-form">
//                 <div className="details">
//                   <h1>SIGN UP</h1>
//                   <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                       <label
//                         htmlFor="email"
//                         className="form-label float-start text-white mb-4"
//                       >
//                         Sign in with email address
//                       </label>
//                       <input
//                         name="email"
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         placeholder="Yourname@gmail.com"
//                         aria-label="Email Address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                       />
//                     </div>

//                     {error && <p className="text-danger">{error}</p>}
//                     {success && <p className="text-success">{success}</p>}

//                     <button className="btn btn-custom mb-3" type="submit">
//                       Sign Up
//                     </button>

//                     <p className="text-center mt-3 mb-3 text-white">
//                       By registering you agree with our{" "}
//                       <a href="#" className="text-primary">
//                         Login
//                       </a>
//                     </p>

//                     <p className="text-center mb-3 text-white">
//                       Or continue with
//                     </p>
//                     <div className="d-flex justify-content-between">
//                       <button className="btn btn-social">
//                         <img src={img1} alt="Google" /> Google
//                       </button>
//                       <button className="btn btn-social">
//                         <img src={img2} alt="Facebook" /> Facebook
//                       </button>
//                     </div>

//                     <p className="text-center mt-3">
//                       By registering you agree with our{" "}
//                       <a href="#" className="text-primary">
//                         Terms and Conditions
//                       </a>
//                     </p>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignUp;

import React, { useState } from "react";
import Cookies from "js-cookie";
import img1 from "../assets/images/google.png";
import img2 from "../assets/images/facebook.png";
import { sendVerificationOtp } from "../utils/authApi";
import { Link, useNavigate } from "react-router-dom";

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
    setLoading(true); // Start loader

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await sendVerificationOtp(email);
      if (res.success) {
        setSuccess("Verification email sent successfully!");
        Cookies.set("user_email", email, { expires: 1 / (24 * 60) });
        navigate("/verify-email");
      } else {
        setError("Failed to send verification email");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }

    setLoading(false); // Stop loader
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

                    <p className="text-center mb-3 text-white">
                      Or continue with
                    </p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-social" disabled={loading}>
                        <img src={img1} alt="Google" /> Google
                      </button>
                      <button className="btn btn-social" disabled={loading}>
                        <img src={img2} alt="Facebook" /> Facebook
                      </button>
                    </div>

                    <p className="text-center mt-3">
                      By registering you agree with our{" "}
                      <a href="#" className="text-primary">
                        Terms and Conditions
                      </a>
                    </p>
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
