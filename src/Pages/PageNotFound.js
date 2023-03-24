import React from "react";
import { Link } from "react-router-dom";
import notfound from "../Images/404.png" 
import "../style/pageNotFound.css"

const Pagenotfound = () => {
  return (

      <div className="pnf">

      <div className="pnf-imgs">
      <img src ={notfound} alt="notfound"/>                      
      </div>

      
        <Link to="/" className="pnf-btns">
          Go Back
        </Link>
      

      </div>
    
  );
};

export default Pagenotfound;