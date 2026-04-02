import React, { useEffect } from "react";
import img1 from "../assets/images/image-1.png";
import img2 from "../assets/images/image.png";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";


const HighLighted = () => {
  useEffect(()=>{
    Aos.init({
      duration: 500,     
    easing: 'ease-in-out',
    })
  },[])
  return (
    <section className="hightlight__section__five  pt-120 pb-120">
      {/*container*/}
      <div className="container">
        {/*Section header*/}
        <div className="section__header  pb__60">
          <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-6">
              <h2
                className="text-right !text-4xl"
                data-aos="fade-down"
              >
                100% AI Smarter Facial <br />
                Faster Solutions
              </h2>
            </div>
          </div>
        </div>
        {/*Section header*/}
        <div className="row">
          <div className="col-md-6 text-start" style={{color:"white"}}>
            <p className="mb-5">
              Recognized with <br />
              Custom AI Tools
            </p>
            <p className="mb-5">
              Our Technology AI Generator website empowers <br />
              individuals and businesses{" "}
            </p>
            <img
              src={img1}
              alt="AI Face"
              className="mb-5 img-fluid rounded"
              style={{ width: 250 }}
            />
            <div className="row mb-5">
              <div className="col-lg-6 col-6 d-flex">
                <div>
                  <h4 className="text-white">
                    {" "}
                    123.4+ <br />
                    <span style={{ fontSize: 14 }}>Technology</span>
                  </h4>
                </div>
              </div>
              <div className="col-lg-6 col-6">
                <span>
                  Discover the Future of <br />
                  AI Innovation
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-12">
                <div className="btg__grp flex items-center">
                  <Link to={"/"} className="btn btn-primary me-3 br-30">
                    <span>Read More →</span>
                  </Link>
                  <Link to={"/"} className="btn-purple px-4 py-2">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 position-relative">
            <div className="overlay-box smallbox box-top">
              🔹 Vision AI Technology
              <br />
              <span className="ms-3">
                Our Technology AI Generator website <br />{" "}
                <span className="ms-3">empowers individuals</span>
              </span>
            </div>
            <div className="overlay-box smallbox box-middle">
              🔹 Our Technology AI Generator <br />
              <span className="ms-3">website empowers individuals</span>
            </div>
            <div className="overlay-box smallbox box-bottom">
              🔹 Vision AI Technology
              <br />
              <span className="ms-3">
                Our Technology AI Generator website <br />{" "}
                <span className="ms-3">empowers individuals</span>
              </span>
            </div>
            <img
              src={img2}
              alt="AI Smart Facial Recognition"
              className="w-100 img-fluid rounded"
            />
          </div>
        </div>
      </div>
      {/*container*/}
    </section>
  );
};

export default HighLighted;
