import React, { useEffect, useRef, useState } from "react";
import img1 from "../assets/assets/img/logo/logo.png";
import img2 from "../assets/images/happy-face.png";
import { Link, useNavigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";

const Landing = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [user, setUser] = useState(null);
   const [avatar, setAvatar] = useState(null);
  
  const navigate = useNavigate();
  const popupRef = useRef(null);

  /* ===== GET USER FROM LOCAL STORAGE ===== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIMG = localStorage.getItem("createdAvatarImageUrl");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setAvatar(storedIMG)
      } catch (err) {
        console.error("Invalid user data");
      }
    }
  }, []);

  /* ===== CLOSE POPUP ON OUTSIDE CLICK ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowLogoutPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  return (
    <>
      <Header1 />

      <section className="pt-120 pb-120 mt-5 mb-5">
        <div className="container">
          <div className="row align-items-center pt-80 justify-content-center">
            <div className="col-lg-12 mb-5">
              <h4 className="text-white mb-2">Hello,</h4>
              <h2 className="text-white">
                {user?.full_name || "Guest"}{" "}
                <img src={img2} style={{ width: 60 }} />
              </h2>
            </div>

            <div className="col-lg-4 text-center pt-5 pb-5">
              
              <h3 className="text-white mb-5">Avatar Not found</h3>
              <Link to={"/customize"} className="btn btn-custom mb-3">
                Let’s Create One
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* <footer className="footer__section footer__section__five">
        <div className="container">
          <div className="footer__wrapper">
            <div className="footer__top">
              <div className="row g-5">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <div className="widget__head">
                      <a href="index.html" className="footer__logo">
                        <img src={img1} alt="logo" style={{ width: 150 }} />
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
                          [email&nbsp;protected]
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
                      <img src="/src/assets/assets/img/svg-icon/facebook.svg" />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="social__item social__itemtwo"
                  >
                    <span className="icon">
                      <img src="/src/assets/assets/img/svg-icon/instagram.svg" />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="social__item social__itemthree"
                  >
                    <span className="icon">
                      <img src="/src/assets/assets/img/svg-icon/twitter.svg" />
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="social__item social__itemfour"
                  >
                    <span className="icon">
                      <img src="/src/assets/assets/img/svg-icon/linkedin.svg" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer> */}

      <Footer/>
    </>
  );
};

export default Landing;
