import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import VerificationMail from "./pages/VerificationMail";
import FillProfile from "./pages/FillProfile";
import SignIn from "./pages/SignIn";
import FaceRecognition from "./pages/FaceRecognition";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/face-recognition" element={<FaceRecognition/>} />
        <Route path="/verify-email" element={<VerificationMail/>} />
        <Route path="/profile" element={<FillProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;
