import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Pagenotfound from "./Pages/PageNotFound";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import { useSelector } from 'react-redux'
import Footer from "./components/Layout/Footer";
import  Header  from "./components/Layout/Header";
import "../src/App.css"

function App() {
  const { user } = useSelector((state) => state.auth)
  return (
    <>
    <Header/>
      <Routes>      
        <Route path="/" element={<HomePage/>} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
        <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
      <Footer/>

    </>
  );
}

export default App;











































































































































	// title: "",
	// name: "",
	// phone:"",
	// email: "",
	// password: "",
	// address:""
