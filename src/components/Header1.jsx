import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/assets/img/logo/seras-logo.jpg";

const Header1 = () => {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [user, setUser] = useState(null);

  // 🔹 Truncate email
  const formatEmail = (email = "") => {
    if (email.length > 18) {
      return email.slice(0, 15) + "...";
    }
    return email;
  };

  // 🔹 Get user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("User parse error", err);
    }
  }, []);

  // 🔹 Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowLogoutPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setShowLogoutPopup(false);
    navigate("/signin");
  };

  return (
    <section className="header-section">
      <header
        className="header py-2 "
        // style={{
        //   borderBottom: "1px solid #ccc", // thin border
        // }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between">
            {/* LOGO */}
            <Link to="/landing" className="d-flex align-items-center">
              <img
                src={img1}
                alt="logo"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Link>

            {/* PROFILE */}
            <div ref={popupRef} className="position-relative">
              <div
                className="d-flex align-items-center gap-2"
                style={{
                  padding: "6px 10px", // 🔥 y-axis padding reduced
                  border: "1px solid #3E70A1",
                  borderRadius: 10,
                  cursor: "pointer",
                }}
                onClick={() => setShowLogoutPopup((p) => !p)}
              >
                <img
                  src="https://www.bootdey.com/img/Content/avatar/avatar2.png"
                  alt="avatar"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                  }}
                />

                <div className="d-flex flex-column">
                  <span
                    style={{
                      fontSize: 14,
                      color: "#ba185e",
                      lineHeight: "16px",
                      fontWeight: 500,
                    }}
                  >
                    {user?.full_name || "Guest User"}
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      color: "#aaa",
                      lineHeight: "14px",
                    }}
                    title={user?.email || ""}
                  >
                    {formatEmail(user?.email)}
                  </span>
                </div>
              </div>

              {/* LOGOUT POPUP */}
              {showLogoutPopup && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    background: "#111",
                    borderRadius: 8,
                    minWidth: 160,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    zIndex: 9999,
                  }}
                >
                  <Link
                    to="/profile"
                    className="d-block px-3 py-2 text-white"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowLogoutPopup(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    to="/history"
                    className="d-block px-3 py-2 text-white"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowLogoutPopup(false)}
                  >
                    History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-100 text-start px-3 py-2"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ff4d4f",
                      cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </section>
  );
};

export default Header1;
