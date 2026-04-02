import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import VerificationMail from "./pages/VerificationMail"
import FillProfile from "./pages/FillProfile"
import SignIn from "./pages/SignIn"
import FaceRecognition from "./pages/FaceRecognition"
import Result from "./pages/result"
import Landing from "./pages/Landing"
import PublicRoute from "./components/PublicRoute"
import CustomizeAvtar from "./pages/CustomizeAvtar"
import FinalAvtar from "./pages/FinalAvtar"
import AvtarSuccess from "./pages/AvtarSuccess"
import Chat from "./pages/Chat"
import History from "./pages/history"
import AddVoice from "./pages/AddVoice"
import VoiceRecordingStarted from "./pages/VoiceRecordingStarted"
import VoiceRecordingCompleted from "./pages/VoiceRecordingCompleted"
import AddCredit from "./pages/AddCredit"
import SelectOption from "./pages/SelectOption"

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route path="/face-recognition" element={<FaceRecognition />} />
        <Route path="/verify-email" element={<VerificationMail />} />
        <Route path="/profile" element={<FillProfile />} />
        <Route path="/result" element={<Result />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/history" element={<History />} />
        <Route path="/customize" element={<CustomizeAvtar />} />
        <Route path="/final" element={<FinalAvtar />} />
        <Route path="/addVoice" element={<AddVoice />} />
         <Route path="/voice-recording-started" element={<VoiceRecordingStarted />} />
          <Route path="/voice-recording-completed" element={<VoiceRecordingCompleted />} />
          <Route path="/AddCredit" element={<AddCredit />} />
          <Route path="/selectOption" element={<SelectOption />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/avtarsucess" element={<AvtarSuccess />} />
      </Routes>
    </Router>
  )
}

export default App
