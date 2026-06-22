import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Plane, User } from 'lucide-react';
import { userContext } from '../../context/userContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Destructuring your login status context
  const { isLogin, setLogin } = useContext(userContext);

  function logout() {
    localStorage.removeItem('userToken');
    setLogin(null);
    closeMobileMenu();
    navigate('/login');
  }

  const closeMobileMenu = () => {
    const menu = document.getElementById('navbarNav');
    if (menu && menu.classList.contains('show')) {
      const bootstrap = window.bootstrap;
      if (bootstrap && bootstrap.Collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(menu) || new bootstrap.Collapse(menu);
        bsCollapse.hide();
      } else {
        menu.classList.remove('show');
      }
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarContainer}`}>
      <div className="container-fluid px-3">
        
        {/* BRAND */}
        <Link 
          className={`navbar-brand d-flex align-items-center gap-2 text-nowrap ${styles.brand}`} 
          to="/"
          onClick={closeMobileMenu}
        >
          <Plane size={36} className={styles.planeIcon} />
          <span className={styles.brandText}>TRAVEL</span>
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU PANEL */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* NAV LINKS */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                to="/"
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                } 
                to="/flights"
                onClick={closeMobileMenu}
              >
                Flights
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                } 
                to="/destinations"
                onClick={closeMobileMenu}
              >
                Destinations
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                } 
                to="/planner"
                onClick={closeMobileMenu}
              >
                Planner
              </NavLink>
            </li>

            {isLogin && (
              <>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) =>
                      isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    } 
                    to="/dashboard"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) =>
                      isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    } 
                    to="/tripsWorkspace"
                    onClick={closeMobileMenu}
                  >
                    Trips Workspace
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) =>
                      isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                    } 
                    to="/profile"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* RIGHT SIDE ACTIONS */}
          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-3 mt-3 mt-lg-0">
            {!isLogin ? (
              <>
                <Link 
                  className={`text-center ${styles.btnLog}`} 
                  to="/login"
                  onClick={closeMobileMenu}
                >
                  LOG IN
                </Link>

                <Link 
                  className={`text-center ${styles.btnReg}`} 
                  to="/register"
                  onClick={closeMobileMenu}
                >
                  REGISTER
                </Link>
              </>
            ) : (
              <div className="d-flex align-items-center flex-column flex-lg-row gap-3">
                
                {/* DYNAMIC USER PROFILE AVATAR BADGE */}
                <Link 
                  to="/profile" 
                  className={`d-flex align-items-center gap-2 text-decoration-none ${styles.profileBadge}`}
                  onClick={closeMobileMenu}
                >
                  <div className={styles.avatarCircle}>
                    <User size={16} />
                  </div>
                  {/* Tries to read user's name from context object, falls back safely to 'Profile' if empty */}
                  <span className={styles.profileName}>
                    {isLogin?.name || isLogin?.username || isLogin?.user?.name || "Profile"}
                  </span>
                </Link>

                <button onClick={logout} className={`btn btn-outline-danger ${styles.btnLogout}`}>
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}