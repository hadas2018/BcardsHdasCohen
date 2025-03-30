import { FunctionComponent, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useSearch } from "./context/SearchContext";
import SearchInput from "./SearchInput";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const { setSearchTerm, setIsSearching } = useSearch();
  const [showTooltip, setShowTooltip] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const location = useLocation();
  const isSearchablePage = () => {
    return ["/", "/my-cards", "/favorite-cards", "/admin"].includes(
      location.pathname
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");

      if (
        navbar &&
        !navbar.contains(event.target as Node) &&
        toggler &&
        !toggler.contains(event.target as Node) &&
        navbarOpen
      ) {
        setNavbarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [navbarOpen]);

  const getDisplayName = () => {
    if (!user) return "משתמש";

    if (user.name) {
      if (user.name.first && user.name.last) {
        return `${user.name.first} ${user.name.last}`;
      } else if (user.name.first) {
        return user.name.first;
      } else if (user.name.last) {
        return user.name.last;
      }
    }

    return user.email || user._id.substring(0, 8) || "משתמש";
  };

  const canCreateCard = () => {
    if (!user) return false;
    return user.isAdmin || user.isBusiness;
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(term.trim() !== "");
  };

  return (
    <>
      <nav className="navbar bg-secondary-subtle navbar-expand-lg mb-4 sticky-top border-bottom py-3 px-3">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "1",
                fontWeight: "bold",
              }}
            >
              <img
                src="/blogo.png"
                alt="B"
                style={{
                  height: "70px",
                  marginRight: "-20px",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
              <span
                style={{
                  fontSize: "26px",
                  display: "inline-block",
                  verticalAlign: "middle",
                  letterSpacing: "-0.5px", // מצמצם את המרווח בין האותיות בטקסט
                }}
              >
                Cards
              </span>
            </div>
          </Link>

          <div className="d-flex align-items-center">
            {/* Hamburger button with animation */}
            <button
              className={`navbar-toggler ${navbarOpen ? "active" : ""}`}
              type="button"
              onClick={toggleNavbar}
              aria-controls="navbarNav"
              aria-expanded={navbarOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <div className="hamburger-icon">
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </button>
          </div>

          <div
            className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/About"
                  onClick={() => setNavbarOpen(false)}
                >
                  About
                </Link>
              </li>

              {/* Links shown only for logged-in users */}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/my-cards"
                      onClick={() => setNavbarOpen(false)}
                    >
                      My-Cards
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/favorite-cards"
                      onClick={() => setNavbarOpen(false)}
                    >
                      Favorites
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center">
              {isLoading ? (
                <div>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </div>
              ) : isLoggedIn ? (
                <div className="d-flex align-items-center">
                  {user?.image?.url && (
                    <Link
                      className="nav-link"
                      to="/profile"
                      onClick={() => setNavbarOpen(false)}
                    >
                      <img
                        src={
                          user?.image?.url &&
                          !user.image.url.includes("pixabay") &&
                          !user.image.url.includes("avatar")
                            ? user.image.url
                            : "https://bcard-client.onrender.com/assets/user-BErsOE_C.png"
                        }
                        alt={user?.image?.alt || "User profile"}
                        className="rounded-circle me-2"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </Link>
                  )}
                  <span className="me-3">Hello {getDisplayName()}</span>
                  {user?.isAdmin && (
                    <span className="badge bg-info me-2">admin</span>
                  )}
                  {user?.isBusiness && (
                    <span className="badge bg-success me-2">business</span>
                  )}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      logout();
                      setNavbarOpen(false);
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary"
                    onClick={() => setNavbarOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {isSearchablePage() && (
          <div className="me-2" style={{ width: "180px" }}>
            <SearchInput
              onSearch={handleSearch}
              placeholder="חיפוש..."
              autoFocus={false}
            />
          </div>
        )}

        {/* Theme toggle */}
        <div className="me-2">
          <ThemeToggle />
        </div>
      </nav>

      {isLoggedIn && canCreateCard() && (
        <div className="position-relative">
          <Link
            to="/new-card"
            className="btn btn-primary rounded-circle position-fixed"
            style={{
              width: "56px",
              height: "56px",
              bottom: "100px",
              right: "24px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="Create a new card"
          >
            +
          </Link>

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="position-fixed bg-dark text-white py-2 px-2 rounded"
              style={{
                bottom: "88px",
                right: "24px",
                zIndex: 1000,
                fontSize: "14px",
                transition: "opacity 0.2s",
                opacity: showTooltip ? 1 : 0,
              }}
            >
              Create a new card
            </div>
          )}
        </div>
      )}

      {/* CSS for hamburger animation */}
      <style>{`
        .hamburger-icon {
          width: 30px;
          height: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .hamburger-icon .line {
          display: block;
          height: 3px;
          width: 100%;
          border-radius: 3px;
          background-color: var(--bs-body-color);
          position: absolute;
          transition: all 0.3s ease;
        }

        .hamburger-icon .line:nth-child(1) {
          top: 0;
        }

        .hamburger-icon .line:nth-child(2) {
          top: 10px;
        }

        .hamburger-icon .line:nth-child(3) {
          top: 20px;
        }

        .navbar-toggler.active .hamburger-icon .line:nth-child(1) {
          transform: translateY(10px) rotate(45deg);
        }

        .navbar-toggler.active .hamburger-icon .line:nth-child(2) {
          opacity: 0;
        }

        .navbar-toggler.active .hamburger-icon .line:nth-child(3) {
          transform: translateY(-10px) rotate(-45deg);
        }

        .navbar-toggler:focus {
          box-shadow: none;
        }

        /* התאמות עיצוב לחיפוש במובייל */
        @media (max-width: 767px) {
          .input-group .form-control {
            font-size: 14px;
            height: 36px;
          }
          .input-group .input-group-text {
            height: 36px;
            padding: 0 8px;
          }
          .input-group .btn {
            height: 36px;
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
