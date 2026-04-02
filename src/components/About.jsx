import React, { useEffect } from 'react'
import img1 from "../assets/images/image-2.png"
import Aos from 'aos'
import "aos/dist/aos.css";

const About = () => {
  useEffect(()=>{
    Aos.init({duration: 500,     
      easing: 'ease-in-out',})
  },[])
  return (
    <section className="about__section__five  pt-120 pb-120">
    {/*Container*/}
    <div className="container">
      <div className="section__header section__center pb__60">
        <h2 className="!text-4xl" data-aos="fade-up">
          Revolutionize Facial <br />
          Recognition with Us
        </h2>
      </div>
      <div className="row align-items-center justify-content-center">
        {/*about content*/}
        <div className="col-lg-12">
          <div className="about__content">
            <img src={img1} style={{ width: "100%" }} />
          </div>
        </div>
        {/*about content*/}
      </div>
    </div>
    {/*Container*/}
  </section>
  )
}

export default About