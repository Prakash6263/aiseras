import axios from "axios";

const API_URL = "https://api.aiseras.com/aiseras";
// const API_URL = "https://54.66.171.2/aiseras";

// const API_URL = "http://localhost:8001/api";


export const registerWithEmail = async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  return response.data; // 👈 return only the body
};


export const verifyEmailOTP = async (formData) => {
  const response = await axios.post(`${API_URL}/verify-email`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  return response.data;
};


export const completeUserProfile = async (formData) => {
  const response = await axios.post(`${API_URL}/complete-profile`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  console.log("login-response",response.data)
  return response.data;
};


export const uploadFaceImage = async (imageBlob) => {
  const formData = new FormData();
  formData.append("file", imageBlob, "capture.jpg");

  const response = await axios.post(`${API_URL}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
};


export const captureFace = async (imageBase64) => {
  const payload = new URLSearchParams();
  payload.append("image_base64", imageBase64);

  const response = await axios.post(`${API_URL}/capture-face`, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });

  return response.data;
};
