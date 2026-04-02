import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import img2 from "../assets/assets/img/logo/logo.png";

import img1 from '../assets/images/happy-face.png';
import angry from '../assets/images/angry.png';
import sad from '../assets/images/sad-face.png';
import neutral from '../assets/images/neutral.png';
import surprised from '../assets/images/surprised.png';
import disgusted from '../assets/images/disgusted.png';
import fear from '../assets/images/fear.png';
import instagram from '../assets/assets/img/svg-icon/instagram.svg'
import Header1 from '../components/Header1';

const Result = () => {
  const location = useLocation();
  const dominantEmotion = location.state?.dominantEmotion || 'neutral';

  const emotionImages = {
    happy: img1,
    sad: sad,
    angry: angry,
    neutral: neutral,
    surprise: surprised,
    surprised: surprised,
    disgust: disgusted,
    disgusted: disgusted,
    fear: fear
  };

  const imageToShow = emotionImages[dominantEmotion.toLowerCase()] || neutral;

  return (
    <>
      {/* Header Section */}
      <Header1/>
     {/* <section className="header-section">
       <div className="header-testting-wrap">
         <header className="header">
           <div className="container-fluid">
             <div className="header-testting-inner d-flex align-items-center justify-content-between">
         
               <div className="header-item item-left">
                 <div className="logo-menu">
                   <Link to={"/landing"} className="logo d-xl-block">
                     <img
                       src={`${img2}`}
                       alt="logo"
                       style={{ width: 150 }}
                     />
                   </Link>
                 </div>
               </div>
            
               <div className="header-item">
                 <div className="menu-overlay" />
                 <nav className="menu">
                  
                   <div className="mobile-menu-head">
                     <div className="go-back">
                       <i className="material-symbols-outlined">arrow_back_ios</i>
                     </div>
                     <div className="current-menu-title" />
                     <div className="mobile-menu-close">×</div>
                   </div>
                 </nav>
               </div>
               
               <div className="header-item item-righ d-flex align-items-center justify-content-center">
                 <div className="menu__components">
                   <div
                     className="d-flex gap-3 p-2"
                     style={{ border: "1px solid #3E70A1", borderRadius: 10 }}
                   >
                     <a href="profile.html">
                       <img
                         src="https://www.bootdey.com/img/Content/avatar/avatar2.png"
                         style={{ width: 40, borderRadius: "100%" }}
                       />
                     </a>
                     <a href="profile.html">
                       <span style={{ fontSize: 14 }}>Richard Jhons</span>
                       <br />
                       <span style={{ fontSize: 14 }}>
                         <strong style={{ color: "#C30EFF" }}>Credit:</strong> $125
                       </span>
                     </a>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </header>
       </div>
     </section> */}

      {/* Emotion Result Section */}
      <section className="pt-120 ">
        <div className="container">
          <div className="row align-items-center pt-80 justify-content-center">
            <div className="col-lg-6 text-center">
              <h2 className="text-white mb-2">{dominantEmotion.charAt(0).toUpperCase() + dominantEmotion.slice(1)} Face Captured</h2>
              <div className="text-center pt-5 pb-5">
                <p>
                  A dummy text generator is a tool that produces random text for use
                  in design mockups and content previews, mimicking the structure
                  and format of readable content without having any meaningful
                  information.
                </p>
                <img src={imageToShow} alt={dominantEmotion} style={{ width: 200 }} className="mx-auto d-block" />
              </div>
              <Link to="/customize" className="btn btn-custom mb-3 w-50">
                Next
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
   <footer className="footer__section footer__section__five">
    <div className="container">
      <div className="footer__wrapper">
        <div className="footer__top">
          <div className="row g-5">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget">
                <div className="widget__head">
                  <a href="index.html" className="footer__logo">
                    <img
                      src={`${img2}`}
                      alt="logo"
                      style={{ width: 150 }}
                    />
                  </a>
                </div>
                <p className="pb__20">
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
                  <img src="/src/assets/assets/img/svg-icon/facebook.svg" alt="svg" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="social__item social__itemtwo"
              >
                <span className="icon">
                  <img src={`${instagram}`} alt="svg" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="social__item social__itemthree"
              >
                <span className="icon">
                  <img src="/src/assets/assets/img/svg-icon/twitter.svg" alt="svg" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="social__item social__itemfour"
              >
                <span className="icon">
                  <img src="/src/assets/assets/img/svg-icon/linkedin.svg" alt="svg" />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
    </>

  );
};

export default Result;
