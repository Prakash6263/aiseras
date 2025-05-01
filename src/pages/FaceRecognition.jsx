import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import img1 from "../assets/images/frame.png"

const FaceRecognition = () => {
    return (
        <>
            {/* Header top Here */}
            <section className="header-section">
                <div className="header-testting-wrap">
                    <Header />
                </div>
            </section>
            {/* Header top End */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n         .camera-container {\n            position: relative;\n            width: 250px;\n            height: 250px;\n        }\n        video, canvas {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            object-fit: cover;\n        }\n        .frame-overlay {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            pointer-events: none;\n        }\n        .buttons {\n            margin-top: 20px;\n            display: none;\n        }\n        button {\n            padding: 10px 20px;\n            margin: 5px;\n            cursor: pointer;\n            border: none;\n            background-color: purple;\n            color: white;\n            border-radius: 5px;\n        }\n"
                }}
            />
            <section className="pt-120 pb-120 mt-5 mb-5">
                <div className="container">
                    <div className="row align-items-center pt-80 justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 className="text-white mb-5">Help Us Record Your Emotion</h2>
                            <div
                                className="text-center pt-5 pb-5"
                                style={{ backgroundColor: "#222", borderRadius: 25 }}
                            >
                                <center>
                                    <div className="camera-container text-center mb-5">
                                        <video id="video" autoPlay="" style={{ borderRadius: 10 }} />
                                        <canvas id="canvas" style={{ display: "none" }} />
                                        <img
                                            src={img1}
                                            className="frame-overlay"
                                            alt="Frame Overlay"
                                        />
                                    </div>
                                </center>
                                <button
                                    id="capture"
                                    className="btn btn-custom mb-3 w-50"
                                    data-bs-toggle="modal"
                                    data-bs-target="#confirm"
                                >
                                    Continue
                                </button>
                                <div className="buttons">
                                    <button id="recapture">Recapture</button>
                                    <button id="remove">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="modal" id="confirm" style={{ top: "10%" }}>
                <div className="modal-dialog">
                    <div
                        className="modal-content"
                        style={{ backgroundColor: "#191919", borderRadius: 25 }}
                    >
                        <div className="modal-body text-center p-5">
                            <h2 className="text-white mb-5">Face Recognition</h2>
                            <p className="text-white mb-5">
                                A dummy text generator is a tool that produces random text for use
                                in design mockups and content previews, mimicking the structure and
                                format of readable content without having any meaningful
                                information.
                            </p>
                            <button className="btn btn-custom mb-3 w-50" data-bs-dismiss="modal">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/* Footer End */}
        </>

    )
}

export default FaceRecognition