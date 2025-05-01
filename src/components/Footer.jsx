import React from "react";
import img1 from "../assets/assets/img/logo/logo.png";
import img2 from "../assets/assets/img/svg-icon/facebook.svg";
import img3 from "../assets/assets/img/svg-icon/instagram.svg";
import img4 from "../assets/assets/img/svg-icon/twitter.svg";
import img5 from "../assets/assets/img/svg-icon/linkedin.svg";

const Footer = () => {
  return (
    <footer className="footer__section footer__section__five">
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
                  <p className="pb__20" style={{ color: "white" }}>
                    Artificial Intelligence (AI) and Machine Learning (ML) are
                    closely related technologies that enable computers to learn
                    from data and make predictions
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
                      <span className="fcontact__content">(XXX) XXX-XXXX</span>
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
            <ul className="footer__bottom__link" style={{ color: "white" }}>
              <li>
                <a href="support.html" style={{textDecoration:"none",color: "white"}}>Terms</a>
              </li>
              <li>
                <a href="support.html" style={{textDecoration:"none",color: "white"}}>Privacy</a>
              </li>
              <li>
                <a href="support.html" style={{textDecoration:"none",color: "white"}}>Cookies</a>
              </li>
            </ul>
            <p>© 2025 By Aiseras. All Rights Reserved.</p>
            <ul className="social">
              <li>
                <a href="javascript:void(0)" className="social__item">
                  <span className="icon">
                    <img src={img2} alt="svg" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="social__item social__itemtwo"
                >
                  <span className="icon">
                    <img src={img3} alt="svg" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="social__item social__itemthree"
                >
                  <span className="icon">
                    <img src={img4} alt="svg" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="javascript:void(0)"
                  className="social__item social__itemfour"
                >
                  <span className="icon">
                    <img src={img5} alt="svg" />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
