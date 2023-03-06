import React ,{useState} from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from "../../redux/authSlice"
import "./header.css"
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true)
    return () => (window.onscroll = null)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
 }

  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">   
            <h1>React</h1>
            <ul className="navbar-nav">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
             
              {!user ? (
                <>
                  <li>
                    <Link to="/register" className="nav-link-reg">
                      Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link-log">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {user.name}
                    </Link>
                    <ul className="dropdown-menu">
                    
                      <li>
                        <Link
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
             
            </ul>
          </div>
        </nav>
    </>
  );
};

export default Header;