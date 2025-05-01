import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import BannerHome from "../components/BannerHome";
import About from "../components/About";
import HighLighted from "../components/HighLighted";
import img1 from "../assets/images/image-5.png";
import img2 from "../assets/images/image-6.png";
import img3 from "../assets/images/image-7.png";
import img4 from "../assets/images/image-8.png";
import img5 from "../assets/images/3d-head.png";
import img6 from "../assets/images/image-3.png";
import img7 from "../assets/images/image-4.png";
import img8 from "../assets/images/activity_zone.png";
import Cookies from "js-cookie";

const Home = () => {
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  console.log(userData);

  return (
    <>
      {/* Header top Here */}
      <Header />
      {/* Header top End */}
      {/* Banner Here */}
      <BannerHome />
      {/* Banner End */}
      <section className="pt-5" style={{ color: "white" }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="text-left col-lg-3 col-4">
              <h1>12+ </h1>
              <span style={{ fontSize: 20 }}>
                Face <br />
                Recognition
              </span>
            </div>
            <div className="image-section col-lg-3 col-8">
              <img
                src={img5}
                alt="AI Face Recognition"
                style={{ width: "100%", marginBottom: 20 }}
              />
            </div>
            <div className="text-right col-lg-6 col-12">
              Transform Ideas into Reality
              <br />
              <br />
              Power of AI at Your Fingertips &nbsp;&nbsp;&nbsp;&nbsp; AI Partner
              for Smarter
            </div>
          </div>
        </div>
      </section>
      {/* About Here */}
      <About />
      {/* About End */}
      {/* highlight Here */}
      <HighLighted />
      {/* highlight End */}
      {/* highlight Here */}
      <section className="hightlight__section__five  pt-120 pb-120">
        {/*container*/}
        <div className="container">
          {/*Section header*/}
          <div className="section__header  pb__60">
            <div className="row">
              <div className="col-lg-6">
                <h2 className="wow fadeInDown" data-wow-duration="1.5s">
                  Discover the 100% <br />
                  accuracy of AI Recognition
                </h2>
              </div>
              <div className="col-lg-6">
                <p>
                  From generating complex algorithms to simple AI-driven tools,
                  we offer cutting-edge solutions that cater to every need.
                  Whether you’re a developer, entrepreneur
                </p>
              </div>
            </div>
          </div>
          {/*Section header*/}
          <div className="row">
            <div className="col-md-3 text-start">
              <img
                src={img6}
                alt="AI Face"
                className="mb-5 img-fluid rounded"
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-md-9 position-relative pl-2">
              <div className="row mb-5">
                <div className="col-lg-8">
                  <div className="btg__grp mb-5">
                    <a
                      href="#"
                      className="btn btn-purple  me-2"
                      style={{ width: "auto" }}
                    >
                      Simplifying AI for Everyone
                    </a>
                    <a
                      href="#"
                      className="btn btn-primary br-30"
                      style={{ width: "auto" }}
                    >
                      <span>AI Generator Platform</span>
                    </a>
                  </div>
                  <h3 className="text-white mb-5">
                    Empower Your Vision with <br />
                    AI Technology
                  </h3>
                  <p className="mb-5" style={{ color: "white" }}>
                    <small>
                      From generating complex algorithms to simple AI-driven
                      tools, we offer <br />
                      cutting-edge solutions that cater to every need.
                    </small>
                  </p>
                </div>
                <div className="col-lg-4">
                  <img
                    src={img7}
                    alt="AI Face Recognition"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div className="row align-items-center smallbox">
                <div className="image-section col-lg-2 col-3">
                  <img
                    src={img8}
                    alt="AI Face Recognition"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="col-lg-7 text-left col-9">
                  <p className="mb-3">
                    Innovate Faster with Our AI <br />
                    Generator Platform
                  </p>
                  <p>
                    <small>
                      From generating complex algorithms to simple <br />
                      AI-driven tools, we offer cutting-edge
                    </small>
                  </p>
                </div>
                <div className="text-left col-lg-3 col-12">
                  <h1>12+ </h1>
                  <span style={{ fontSize: 20 }}>Digital Experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*container*/}
      </section>
      {/* highlight End */}
      {/* work section five Here */}
      <section className="five__work__section  pt-120 pb-120">
        {/*container*/}
        <div className="container">
          {/*Header*/}
          <div className="section__header section__center pb__60">
            <h2 className="wow fadeInUp" data-wow-duration="1.5s">
              Transform Ideas into Reality with Cutting-Edge AI Solutions
            </h2>
          </div>
          {/*Header*/}
          <div className="row g-4">
            {/*col*/}
            <div
              className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 wow fadeInDown"
              data-wow-duration="1.2s"
            >
              <div className="five__work__items">
                <div>
                  <img src={img1} alt="img" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
            {/*col*/}
            <div
              className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 wow fadeInDown"
              data-wow-duration="1.4s"
            >
              <div className="five__work__items five__work__2">
                <div>
                  <img src={img2} alt="img" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
            {/*col*/}
            <div
              className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 wow fadeInDown"
              data-wow-duration="1.6s"
            >
              <div className="five__work__items five__work__3">
                <div>
                  <img src={img3} alt="img" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
            {/*col*/}
            <div
              className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-6 wow fadeInDown"
              data-wow-duration="1.8s"
            >
              <div className="five__work__items five__work__4">
                <div>
                  <img src={img4} alt="img" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
            {/*col*/}
          </div>
        </div>
        {/*container*/}
      </section>
      {/* work section five End */}
      {/* Footer Here */}
      <Footer />
      {/* Footer End */}
    </>
  );
};

export default Home;
