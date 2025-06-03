import React, { useState} from "react";
import axios from "axios"
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../redux/authSlice'


import "../../style/login.css";
const Login = () => {
 

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [result, setResult] = useState();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async(e) => {
    e.preventDefault()
  
    
        await fetch(`https://cust-rks8.onrender.com/api/auth/login`, {
    headers: {
      'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({email, password})
})

.then((res)=>{
  res.json()
  .then((resp)=>{

    const token = resp.data.token
    const name = resp.data.name
    const data = res.json()
    
    dispatch(login(data)) 
   
    localStorage.setItem("token", token)    
    localStorage.setItem("name", name)  
    if (token) {
              navigate('/Dashboard')  
              axios.defaults.headers.common.Authorization = `Bearer ${token}`;
             
          }
          else
              delete axios.defaults.common.Authorization;
         
  })

})     
 
  }
  return (
      <div className="container">
        <form onSubmit={handleLogin}>
          <h4 className="title">Log In</h4>

          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              id="exampleInputEmail1"
              placeholder=" Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              id="exampleInputPassword1"
              placeholder=" Enter Your Password"
              required
            />
          </div>
         

          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
          <p>Don't have an account? <Link to='/register' className="link">Register</Link></p>
        </form>
      </div> 
  );
};

export default Login;
