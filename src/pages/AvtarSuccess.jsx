import React from 'react'
import Header from "../components/Header";
import sucess from '../assets/images/success.png';
import Footer from '../components/Footer';
const AvtarSuccess = () => {
  return (
    <>
  {/* Header top Here */}
<Header />
  {/* Header top End */}
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        body {\n            background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);\n            color: white;\n            \n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 0;\n        }\n        .container {\n            max-width: 100%;\n            margin: auto;\n            padding: 20px;\n        }\n        \n    \n    "
    }}
  />
  <section className="pt-120 pb-120 mt-5 mb-5">
    {/*Container*/}
    <div className="container">
      <div className="row align-items-center pt-80 justify-content-center">
        <div className="col-lg-8 text-center">
          <h1 className="mb-3">Your Avatar has added successfully</h1>
          <p className="mb-5 text-white">This is how you looks like</p>
          <div className="avatar-container mb-5" style={{ display: "flex", justifyContent: "center" }}>
            {/* Display the avatar image */}
            <img src={`${sucess}`} alt="Avatar" className="avatar" />
          </div>
          <h1 className="mb-3">Now Help Us Add Your Voice </h1>
          <p className="mb-5 text-white">This is how you looks like</p>
          <a href="add-voice.html" className="btn btn-custom mb-3 w-25">
            Add Voice
          </a>
        </div>
      </div>
    </div>
  </section>
  {/* Footer Here */}
  {/* <footer className="footer__section footer__section__five">
    <div className="container">
      <div className="footer__wrapper">
        <div className="footer__top">
          <div className="row g-5">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6">
              <div className="footer__widget">
                <div className="widget__head">
                  <a href="index.html" className="footer__logo">
                    <img
                      src="assets/img/logo/logo.png"
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
                  <img src="assets/img/svg-icon/facebook.svg" alt="svg" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="social__item social__itemtwo"
              >
                <span className="icon">
                  <img src="assets/img/svg-icon/instagram.svg" alt="svg" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="social__item social__itemthree"
              >
                <span className="icon">
                  <img src="assets/img/svg-icon/twitter.svg" alt="svg" />
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="social__item social__itemfour"
              >
                <span className="icon">
                  <img src="assets/img/svg-icon/linkedin.svg" alt="svg" />
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer> */}
  {/* Footer End */}
  <Footer/>
</>

  )
}

export default AvtarSuccess
