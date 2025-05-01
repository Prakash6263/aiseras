import React from "react";
import img1 from "../assets/images/Blocks.png";
import img2 from "../assets/images/banner.png";
import img3 from "../assets/images/group.png";

const BannerHome = () => {
  return (
    <section className="banner__section banner__section__five bannerbg" style={{color:"white"}}>
      {/*Container*/}
      <div className="container">
        <div className="banner__wrapper">
          <div className="row g-4  justify-content-between">
            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <div className="banner__content">
                <div className="content__box">
                  <span className="d3 mb-5">
                    Facial emotion recognition through artificial intelligence
                  </span>
                  <p>
                    <small>
                      From generating complex algorithms to simple <br />
                      AI-driven tools, we offer cutting-edge
                    </small>
                  </p>
                  <div className="row mb-5">
                    <div className="col-lg-6 col-6">
                      <span>
                        Faces Don’ttell <br />
                        lieas
                      </span>
                    </div>
                    <div className="col-lg-6 col-6 d-flex flex-wrap">
                      <div className="me-2">
                        <img src={img3} />{" "}
                      </div>
                      <div>
                        <h4 className="text-white">
                          {" "}
                          578M + <br />
                          <span style={{ fontSize: 14 }}>User Active</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-8 col-8">
                      <div className="btg__grp">
                        <a href="#" className="btn btn-primary br-30">
                          <span>Read More →</span>
                        </a>
                        <a href="#" className="btn btn-purple">
                          Learn More →
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-4 col-4 d-flex justify-content-end">
                      <div>
                        <h4 className="text-white">
                          {" "}
                          123.4+ <br />
                          <span style={{ fontSize: 14 }}>Technology</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="banner5__blump">
                    <div className="text-white smallbox">
                      <h4 className="text-white">
                        <span>13+</span>{" "}
                        <span style={{ fontSize: 12 }}>
                          Years of Industry Expertise
                        </span>
                      </h4>
                      <img src={img1} alt="img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-5 col-xl-6 col-lg-6 col-md-11">
              <div className="banner__thumb">
                <div className="thumb">
                  <img src={img2} alt="banner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Container*/}
    </section>
  );
};

export default BannerHome;
