import React from "react";
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../style/dashboard.css"

const Dashboard = () => {
  
  
  const [result, setResult] = useState();
  const navigate = useNavigate()
  
   useEffect(()=>{
        const token = localStorage.getItem("token");
     fetch("http://localhost:5000/ItinararyGet", {
      method: "GET",
      headers: {"Authorization": `Bearer ${token}`},
     
    })
    .then(res => res.json())
    .then(json => setResult(json));
  },[]);
      
    if (result) {
      show(result)
      function show(resp) {

        if(localStorage.getItem("token"))
        {
          navigate('/Dashboard')
        }  
        else{navigate('/login')}  
          
       const data=resp.data
         
        let tab = 
            `<tr> 
              <th>Name</th>
              <th>To</th>
              <th>From</th>
              <th>Date</th>
              <th>Location</th>
              <th>Duration</th>
              <th>Hotel Name</th>
              <th>Total</th>
             </tr>`;
        
       
        for (let d of data) {
            tab += `<tr> 
        <td>${d.name} </td>
        <td>${d.to}</td> 
        <td>${d.from}</td>
        <td>${d.date}</td> 
        <td>${d.location}</td>
        <td>${d.duration}</td> 
        <td>${d.hotelName}</td>
        <td>${d.totalcost}</td>
        
                
     </tr>`;
        }
        document.getElementById("cust").innerHTML = tab;
    }
  } 
    
    
  return (
    <div className="Dashboard-home">
     
     <div className="topcontent">
      <div>
      <Link to="/CreateIt">
      <button type="submit" className="dashcontent">
      Create Itinarary
      </button>
      </Link>
      </div>

      <div>
      <button type="submit" className="dashcontent">    
      Itinarary Update
      </button>
      </div>

      <div>
      <button type="submit" className="dashcontent">  
      Itinarary Data
      </button>
      </div>

     </div>
     
     <div className="datacontent">
     <table id="cust" className="tab"></table>
     


     </div>
    </div>
  );
};

export default Dashboard;
