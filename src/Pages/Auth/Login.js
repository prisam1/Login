import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../redux/authSlice'
import "../../style/login.css";
const Login = () => {
 

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async(e) => {
    e.preventDefault()

    try {
        const res = await fetch(`http://localhost:5000/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({email, password})
        })
        if(res.status === 404){
            throw new Error("Wrong credentials")
        }
        const data = await res.json()
        dispatch(login(data))
        navigate('/')
    } catch (error) {
        setError(prev => true)
        setTimeout(() => {
            setError(prev => false)
        }, 2500)
    }
  }
  return (
 
      <div className="container">
        <form onSubmit={handleLogin}>
          <h4 className="title">LOGIN</h4>

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