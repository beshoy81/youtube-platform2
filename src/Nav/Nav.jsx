import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; 

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const isUserLoggedIn = !!token;

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name || "User"); 
      } catch (error) {
        setUserName("User");
      }
    }
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setShowMobileSearch(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <style>{`
        /* الهيكل الأساسي */
        .yt-navbar { background-color: #000000 !important; height: 56px; border-bottom: 1px solid #333; z-index: 1051; padding: 0 16px; }
        .yt-logo-text { color: #ffffff !important; font-family: 'Roboto', sans-serif; letter-spacing: -0.5px; font-weight: 700; }
        .yt-icon-btn { color: #ffffff !important;  border: none; font-size: 1.2rem; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .yt-icon-btn:hover { background-color: #272727; }
        
        /* تصميم شريط البحث - Desktop */
        .search-container-desktop { display: flex; align-items: center; flex-grow: 1; max-width: 720px; margin: 0 40px; }
        .yt-search-box { display: flex; width: 100%; height: 40px; background: #121212; border: 1px solid #333; border-radius: 40px; overflow: hidden; align-items: center; }
        .yt-search-box:focus-within { border-color: #1c62b9; box-shadow: inset 0 1px 2px rgba(0,0,0,0.3); }
        .yt-search-input { background: transparent !important; color: white !important; border: none !important; padding: 0 15px; font-size: 16px; height: 100%; flex: 1; }
        .yt-search-input::placeholder { color: #888; }
        .yt-search-btn { background-color: #222 !important; border-left: 1px solid #333 !important; color: white !important; width: 64px; height: 100%; border-radius: 0; }
        .yt-search-btn:hover { background-color: #272727 !important; }
        .mic-btn { background: #181818; border: none; color: white; border-radius: 50%; width: 40px; height: 40px; margin-left: 10px; display: flex; align-items: center; justify-content: center; }

        /* البحث في الموبايل - Overlay */
        .mobile-search-active {
          position: fixed; top: 0; left: 0; width: 100%; height: 56px; 
          background: #0f0f0f; display: flex !important; align-items: center; 
          padding: 0 10px; z-index: 2000;
        }

        /* القائمة الجانبية */
        .yt-sidebar { position: fixed; top: 0; left: -240px; width: 240px; height: 100vh; background-color: #0f0f0f !important; z-index: 1060; transition: 0.3s; color: #ffffff !important; border-right: 1px solid #333; }
        .yt-sidebar.open { left: 0; }
        .yt-sidebar-links { list-style: none; padding: 12px 0; }
        .yt-sidebar-links li a, .yt-sidebar-links li button { color: white; text-decoration: none; padding: 12px 24px; display: flex; align-items: center; width: 100%; transition: 0.2s; border: none; background: transparent; }
        .yt-sidebar-links li a:hover { background-color: #272727; }
        .yt-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1055; }

        .signin-link { border: 1px solid #3ea6ff; color: #3ea6ff !important; border-radius: 20px; padding: 5px 15px; font-weight: 500; text-decoration: none; font-size: 14px; }

        @media (max-width: 768px) {
          .search-container-desktop { display: none !important; }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg fixed-top yt-navbar">
        <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap position-relative">
          
 
          {!showMobileSearch && (
            <div className="d-flex align-items-center flex-shrink-0">
              {isUserLoggedIn && (
                <button className="btn yt-icon-btn me-2 shadow-none" onClick={() => setShowSidebar(true)}>
                  <i className="fa-solid fa-bars"></i>
                </button>
              )}
              <Link to="/" className="navbar-brand d-flex align-items-center m-0">
                <i className="fa-brands fa-youtube me-1 text-dangery fs-3"></i>
                <span className="yt-logo-text fs-5">YouTube</span>
              </Link>
            </div>
          )}

          {isUserLoggedIn && (
            <>
      
              <div className="search-container-desktop">
                <form className="yt-search-box" onSubmit={handleSearch}>
                  <input
                    type="text" placeholder="Search"
                    className="form-control yt-search-input shadow-none"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="btn yt-search-btn shadow-none">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </form>
                <button className="mic-btn d-none d-lg-flex"><i className="fa-solid fa-microphone"></i></button>
              </div>

            
              {showMobileSearch && (
                <div className="mobile-search-active">
                  <button className="btn yt-icon-btn me-2" onClick={() => setShowMobileSearch(false)}>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <form className="yt-search-box flex-grow-1" onSubmit={handleSearch}>
                    <input
                      autoFocus
                      type="text" placeholder="Search"
                      className="form-control yt-search-input shadow-none"
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="btn yt-search-btn shadow-none">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </form>
                  <button className="mic-btn ms-2"><i className="fa-solid fa-microphone"></i></button>
                </div>
              )}
            </>
          )}

       
          {!showMobileSearch && (
            <div className="d-flex align-items-center flex-shrink-0">
            
              {isUserLoggedIn && (
                <button className="btn yt-icon-btn d-md-none me-1" onClick={() => setShowMobileSearch(true)}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              )}

              <button onClick={() => setDarkMode(!darkMode)} className="yt-icon-btn me-2">
                {darkMode ? "☀️" : "🌙"}
              </button>

              {isUserLoggedIn ? (
                <div className="dropdown">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${userName}&background=random&color=fff`} 
                    alt="User" className="rounded-circle cursor-pointer"
                    width="32" height="32" data-bs-toggle="dropdown"
                  />
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow-lg border-0 mt-2">
                    <li className="px-3 py-2 border-bottom d-md-none text-info small">{userName}</li>
                    <li><button className="dropdown-item py-2" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket me-2"></i> Logout</button></li>
                  </ul>
                </div>
              ) : (
               <Link to="/signup" className="signin-linke">
  <i className="fa-regular fa-user-circle me-2 fs-5"></i> 
  Sign up
</Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {isUserLoggedIn && (
        <>
          <div className={`yt-sidebar ${showSidebar ? "open" : ""}`}>
            <div className="p-3 d-flex align-items-center border-bottom" style={{borderColor: '#333'}}>
              <button className="btn yt-icon-btn" onClick={() => setShowSidebar(false)}>
                <i className="fa-solid fa-bars"></i>
              </button>
              <span className="ms-3 fw-bold fs-5">YouTube</span>
            </div>
            <ul className="yt-sidebar-links">
              <li><Link to="/" onClick={() => setShowSidebar(false)}><i className="fa-solid fa-house me-3"></i> Home</Link></li>
              <li><Link to="/Shorts" onClick={() => setShowSidebar(false)}><i className="fa-solid fa-bolt me-3"></i> Shorts</Link></li>
              <hr style={{borderColor: '#333'}} />
              <li><button onClick={handleLogout} className="text-danger"><i className="fa-solid fa-right-from-bracket me-3"></i> Logout</button></li>
            </ul>
          </div>
          {showSidebar && <div className="yt-overlay" onClick={() => setShowSidebar(false)}></div>}
        </>
      )}
    </>
  );
}