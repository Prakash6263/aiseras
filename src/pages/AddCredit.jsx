import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Header1 from "../components/Header1";

export default function AddCredit() {
  const [userData, setUserData] = useState({
    name: "",
    credit: 0,
    avatars: [],
  });

  // Simulate fetching data from backend
  useEffect(() => {
    const fetchData = async () => {
      const data = {
        user: { name: "Richard", credit: 250 },
        avatars: [
          {
            id: 1,
            name: "Avatar 1",
            avatarUrl: "https://i.pravatar.cc/40?img=12",
            voice: "Voice 1",
            voiceAdded: true,
            status: "Completed",
          },
          {
            id: 2,
            name: "Avatar 2",
            avatarUrl: "https://i.pravatar.cc/40?img=22",
            voice: null,
            voiceAdded: false,
            status: "Not Completed",
          },
        ],
      };

      setUserData({
        name: data.user.name,
        credit: data.user.credit,
        avatars: data.avatars,
      });
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background:
          "radial-gradient(circle at bottom, #3b1c78 0%, #05010d 55%)",
      }}
    >
      {/* Header */}
      <div className="mb-4 w-100">
        <Header1 />
      </div>

      {/* Main Container */}
      <div className="container text-white mt-30">
        {/* User Info + Credit */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
          <div className="mb-3 mb-md-0">
            <p className="mb-1 text-white">Hello,</p>
            <h2 className="fw-bold text-white">
              {userData.name} <span>🤗</span>
            </h2>
          </div>

          <div className="text-md-end">
            <p className="mb-1 text-white">Credit Left</p>
            <h3 className="fw-bold text-white">${userData.credit}</h3>
          </div>
        </div>

        {/* Table Header */}
        <div className="row text-white small border-bottom pb-2 mb-2 d-none d-md-flex">
          <div className="col-4">Avatar</div>
          <div className="col-3">Voice</div>
          <div className="col-3">Setup</div>
          <div className="col-2 text-end">Action</div>
        </div>

        {/* Avatar Rows */}
        {userData.avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="row align-items-center py-3 border-bottom flex-column flex-md-row"
          >
            <div className="col-12 col-md-4 d-flex align-items-center gap-2 mb-2 mb-md-0">
              <img
                src={avatar.avatarUrl}
                alt={avatar.name}
                className="rounded-circle"
                width={40}
                height={40}
              />
              <div>
                <div className="fw-semibold text-white">{avatar.name}</div>
                <small className="text-white">Avatar created by user</small>
              </div>
            </div>

            <div className="col-12 col-md-3 mb-2 mb-md-0">
              {avatar.voiceAdded ? (
                <div>
                  <div className="fw-semibold text-white">{avatar.voice}</div>
                  <small className="text-white">Voice added by user</small>
                </div>
              ) : (
                <div className="text-white">No</div>
              )}
            </div>

            <div className="col-12 col-md-3 mb-2 mb-md-0">
              {avatar.status === "Completed" ? (
                <span className="text-success fw-semibold">
                  {avatar.status}
                </span>
              ) : (
                <span className="text-danger fw-semibold">{avatar.status}</span>
              )}
            </div>

            <div className="col-12 col-md-2 text-md-end">
              <div className="d-inline-flex align-items-center">
                <FaEdit className="cursor-pointer text-white me-2" />
                <FaTrash className="cursor-pointer text-danger" />
              </div>
            </div>
          </div>
        ))}

        {/* Add Credit Button */}
        <div className="d-flex justify-content-center mt-5">
          <button
            className="btn px-5 py-2 fw-semibold rounded-pill text-white"
            style={{
              background: "linear-gradient(90deg, #6a2fd8, #4aa3ff)",
              border: "none",
            }}
          >
            Add Credit
          </button>
        </div>
      </div>
    </div>
  );
}
