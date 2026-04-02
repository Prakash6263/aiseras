import axios from "axios"

const BASE = "https://api.aiseras.com/aiseras/api"
// const BASE = "https://54.66.171.2/aiseras/api"

function getCurrentUserId() {
  try {
    const idStr = localStorage.getItem("user_id")
    if (idStr) {
      const parsed = Number(idStr)
      return Number.isNaN(parsed) ? idStr : parsed
    }
    const uRaw = localStorage.getItem("user")
    if (uRaw) {
      const id = JSON.parse(uRaw)?.id
      if (id !== undefined && id !== null) return id
    }
  } catch {}
  return 2
}

/**
 * Upload a user image with dynamic user_id
 */
export async function uploadUserImage(file) {
  const formData = new FormData()
  formData.append("file", file)
  const url = `${BASE}/upload-image?user_id=${encodeURIComponent(getCurrentUserId())}`
  const res = await axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    withCredentials: false,
  })
  // console.log("responce",res.data)
  return res.data // expects { success, image_url, ... }
}

/**
 * Create an avatar from an image_url, with dynamic user_id
 */
// export async function createUserAvatar(imageUrl, meta = {}) {
//   console.log("createUserAvatar",imageUrl, meta)
//   const {
//     name = "My Avatar",
//     description = "Avatar created from uploaded image",
//     style = "original",
//   } = meta

//   const body = {
//     user_id: getCurrentUserId(),
//     name,
//     description,
//     image_url: imageUrl,
//     style,
//   }
// console.log("body",body)

//   const res = await axios.post(
//   `${BASE}/create-avatar?style=${encodeURIComponent(style)}`,
//   {
//     user_id: getCurrentUserId(),
//     name,
//     description,
//     image_url: imageUrl,
//   },
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//     withCredentials: false,
//   }
// )


//   return res.data
// }
  // 🔼 Upload Voice API
  export const uploadVoice = async (audioFile) => {
    const formData = new FormData();
    formData.append("file", audioFile);
    const userId= localStorage.getItem("user_id")
    const url =
      `https://api.aiseras.com/aiseras/api/upload-voice` +
      `?user_id=${userId}` +
      `&voice_name=original_recorded_voice` +
      `&voice_description=User recorded voice`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_API_TOKEN",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Voice upload failed");
    }

    return response.json(); // ✅ returns voice_id
  };

export async function createUserAvatar(imageUrl, meta = {}) {
  const {
    name = "prakash",
    description = "i am prakash mishra",
    style = "original", // cartoon, clone, anime
  } = meta
// console.log("createUserAvatar",imageUrl,meta)
  // 🔹 style query me bhej rahe hain
  const url = `${BASE}/create-avatar?image_url=${encodeURIComponent(imageUrl)}&style=${encodeURIComponent(style)}`

  const body = {
    user_id: getCurrentUserId(),
    name,
    description,
  }

  const res = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: false,
  })

  // console.log("createUserAvatar response:", res.data)
  return res.data
}


/**
 * Send a chat message for a given avatar and return assistant response.
 * Uses dynamic user_id
 */
export async function sendChatMessage({ avatar_id, message, voice_type = "default_female" }) {
  
  const url = `${BASE}/chat`
  const idStr = String(avatar_id) // backend expects string
  const body = {
    user_id: getCurrentUserId(),
    avatar_id: idStr,
    message,
    voice_type,
  }

 // console.log("[v0] sendChatMessage payload:", body, { typeOfAvatarId: typeof body.avatar_id })
  const res = await axios.post(url, body, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    withCredentials: false,
  })
  // console.log("[v0] sendChatMessage response:", res?.data)
  return res.data
}

/**
 * Check video generation status by model id.
 * Returns { success, video_model_id, video_status, status_text, video_url, is_ready }
 */
export async function checkVideoStatus(videoModelId) {
  const url = `${BASE}/video-status/${encodeURIComponent(videoModelId)}`
  const res = await axios.get(url, {
    headers: { Accept: "application/json" },
    withCredentials: false,
  })
  return res.data
}

export async function fetchUserHistory({ user_id = getCurrentUserId(), operation_type, limit = 50, offset = 0 } = {}) {
  let url = `${BASE}/users/${encodeURIComponent(user_id)}/history?limit=${limit}&offset=${offset}`
  if (operation_type) {
    url += `&operation_type=${encodeURIComponent(operation_type)}`
  }
  const res = await axios.get(url, {
    headers: { Accept: "application/json" },
    withCredentials: false,
  })
  return res.data // { success, user_id, total_count, operations: [...] }
}
