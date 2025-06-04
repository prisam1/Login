import React, { useState } from "react";
import axios from "axios"; 
import { Link, useNavigate } from "react-router-dom"; 
import useAuth from "../../hooks/useAuth";
import "../../style/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await loginUser(email, password);
      if (token) {
        navigate("/Dashboard");
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else delete axios.defaults.common.Authorization;
    } catch (err) { 
      alert("Invalid credentials");
    }
 
  };
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
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
