"use client"

import { useEffect, useState } from "react"
import img1 from "../assets/assets/img/logo/logo.png"
import { Link, useNavigate } from "react-router-dom" // add useNavigate to handle logout redirect

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 220) {
        setIsFixed(true)
        document.body.classList.add("body-padding")
      } else {
        setIsFixed(false)
        document.body.classList.remove("body-padding")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    try {
      const u = localStorage.getItem("user")
      setUser(u ? JSON.parse(u) : null)
    } catch {
      setUser(null)
    }
    // Also respond to changes from other tabs
    const onStorage = () => {
      try {
        const u = localStorage.getItem("user")
        setUser(u ? JSON.parse(u) : null)
      } catch {
        setUser(null)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    navigate("/signin")
  }

  const isLoggedIn = !!user
  const userName = user?.name || user?.first_name || user?.full_name || user?.email || "User"
  const profileAvatarUrl =
    user?.profile_image ||
    user?.avatar_url ||
    localStorage.getItem("createdAvatarImageUrl") ||
    "https://www.bootdey.com/img/Content/avatar/avatar2.png"
  const credits = user?.credits ?? user?.credit ?? user?.balance ?? user?.wallet_amount ?? 0

  return (
    <section className={`header-section ${isFixed ? "menu-fixed animated fadeInDown" : "slideInUp"}`}>
      <div className="header-testting-wrap">
        <header className="header">
          <div className="container-fluid">
            <div className="header-testting-inner d-flex align-items-center justify-content-between">
              {/* Logo */}
              <div className="header-item item-left">
                <div className="logo-menu">
                  <Link to="/" className="logo d-xl-block">
                    <img src={img1 || "/placeholder.svg"} alt="logo" style={{ width: 150 }} />
                  </Link>
                </div>
              </div>
              {/* Menu Start */}
              <div className="header-item">
                <div className={`menu-overlay ${isMenuOpen ? "active" : ""}`} />
                <nav className="menu">
                  {/* Mobile Menu Head */}
                  <div className="mobile-menu-head">
                    <div className="go-back">
                      <i className="material-symbols-outlined">arrow_back_ios</i>
                    </div>
                    <div className="current-menu-title" />
                    <div className="mobile-menu-close">×</div>
                  </div>
                  {/* Main Menu */}
                  <ul className="menu-main">
                    <li className="menu-item-has-children">
                      <Link to="/" className="menu-mitem d-flex align-items-center">
                        Home
                      </Link>
                    </li>
                    {isLoggedIn && (
                      <li className="menu-item-has-children">
                        <Link to="/history" className="menu-mitem d-flex align-items-center">
                          History
                        </Link>
                      </li>
                    )}
                    <li className="menu-item-has-children">
                      <Link to="/" className="menu-mitem d-flex align-items-center">
                        About Us
                      </Link>
                    </li>
                    <li className="menu-item-has-children">
                      <Link to="/" className="menu-mitem d-flex align-items-center">
                        Services
                      </Link>
                    </li>
                    <li className="menu-item-has-children">
                      <Link to="/" className="menu-mitem d-flex align-items-center">
                        Terms &amp; Conditions
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              {/* Menu End */}
              <div className="header-item item-righ d-flex align-items-center justify-content-center">
                <div className="menu__components d-flex align-items-center">
                  {isLoggedIn ? (
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex gap-3 p-2" style={{ border: "1px solid #3E70A1", borderRadius: 10 }}>
                        <Link to="/profile" aria-label="Open profile">
                          <img
                            src={profileAvatarUrl || "/placeholder.svg"}
                            alt={`${userName}'s avatar`}
                            style={{ width: 40, height: 40, borderRadius: "100%", objectFit: "cover" }}
                          />
                        </Link>
                        <Link to="/profile" className="text-white" aria-label="Open profile details">
                          <span style={{ fontSize: 14 }}>{userName}</span>
                          <br />
                          <span style={{ fontSize: 14 }}>
                            <strong style={{ color: "#C30EFF" }}>Credit:</strong> ${credits}
                          </span>
                        </Link>
                      </div>
                      <button type="button" onClick={handleLogout} className="cmn--btn" aria-label="Log out">
                        <span className="text-amber-400 text-4xl">Logout</span>
                      </button>
                      {/* end change */}
                    </div>
                  ) : (
                    <>
                      <Link to="/signin" className="cmn--btn me-2">
                        <span>Sign In</span>
                      </Link>
                      <Link to="/signup" className="cmn--btn">
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
                {/* Mobile Menu Trigger */}
                <div className="mobile-menu-trigger">
                  <span />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </section>
  )
}

export default Header
