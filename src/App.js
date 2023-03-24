import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Pagenotfound from "./Pages/PageNotFound";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import Footer from "./components/Layout/Footer";
import  Header  from "./components/Layout/Header";
import Dashboard from "./Pages/Dashboard";
import CreateIt from "./Pages/CreateIt"
import "../src/App.css"

function App() {
  // const { user } = useSelector((state) => state.auth)'
    let token=localStorage.getItem("token")
  return (
    <> 
    <Header/>
      <Routes>      
        <Route path="/" element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Register' element={<Register /> } />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/CreateIt' element={<CreateIt />} />
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
