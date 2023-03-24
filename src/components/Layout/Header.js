import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from "../../redux/authSlice"
import "../../style/header.css"
const Header = () => {
  // const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  // window.onscroll = () => {
  //   setIsScrolled(window.pageYOffset === 0 ? false : true)
  //   return () => (window.onscroll = null)
  // }

  function td(){
  if(localStorage.getItem("token"))
    {
      navigate('/Dashboard')
    } 
}
td()
   
  const handleLogout = () => {
    
    navigate('/login') 
    dispatch(logout())
    
    // localStorage.removeItem('token');
    
 }

  return (
    <>
         <div className="top">  
         
            <h1 className="h1">React</h1>
            <div className="navbar-nav">
              
             
              {!(localStorage.getItem("token"))? (
                <>
                  <div>
                <Link to="/" className="nav-link">
                  Home
                </Link>
               </div>
                  <div>
                    <Link to="/Register" className="nav-link-reg">
                      Register
                    </Link>
                  </div>
                  <div className="nav-item">
                    <Link to="/login" className="nav-link-log">
                      Login
                    </Link>
                  </div>
                                  
                </>
              ) : (
                <>
                 
                     <div className="user"> 
                     {localStorage.getItem('token') &&
                     
               <div className="user-name">Welcome, <Link to="/Dashboard" className="nav-link-reg">
               {localStorage.getItem('name')}</Link></div>
              }
                  </div>
                      <div>
                        <Link
                          onClick={handleLogout} className="logout">
                          Logout
                        </Link>
                                             
                      
                    
                  </div>
                </>
              )}
             
            </div>
          </div>
          
    </>
  );
};

export default Header;