import axios from "axios";

// const API_URL = "https://aiseras-backend.onrender.com/api";
const API_URL = "http://localhost:8001/api";

export const sendVerificationOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-verification`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    return { success: false, message: "Failed to send OTP" };
  }
};

export const verificationOtpEmail = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    return { success: false, message: "Failed to send OTP" };
  }
};

export const completeProfileData = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/complete-profile`, data);
    console.log("Response Verification:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    return { success: false, message: "Failed to send OTP" };
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    console.log("Response Verification:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    return { success: false, message: "Failed to send OTP" };
  }
};
