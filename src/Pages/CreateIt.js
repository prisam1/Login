import React, { useState } from "react";
import { useDispatch } from 'react-redux' 
// import {Link} from 'react-router-dom'
import { createIt } from '../redux/authSlice'
import { useNavigate } from "react-router-dom";

import "../style/createIt.css";
const CreateIt = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [date, setDate] = useState("");
  const [to, setTo] = useState("");
  const [location, setLocation] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [totalcost, setTotalcost] = useState("");
  const [duration, setDuration] = useState("");
 

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleCreateIt = async (e) => {
    e.preventDefault()

         
      const token = localStorage.getItem("token");
      
      const res = await fetch(`https://cust-rks8.onrender.com/api`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        method: 'POST', 
        body: JSON.stringify({userId,name,from,to,date,location,duration,hotelName,totalcost})
      })
      const data = await res.json()
      dispatch(createIt(data))
      
      if(!token)
      {
        navigate('/login')
      }  
      else{navigate('/CreateIt')}  
         

    
  }

  return (
   
      <div className="form-container">
        <form onSubmit={handleCreateIt} className="itform">
          <h4 className="title">Create Itinerary</h4>
         
          <div className="mb-3">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="UserId"
              required
              />   
          </div>

         <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="Name"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="From "
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="To"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="Date"
              required
            />
          </div>
          
          <div className="mb-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="Location"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="Duration"
              required
            />
          </div>

          
          <div className="mb-3">
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="Hotel Name"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={totalcost}
              onChange={(e) => setTotalcost(e.target.value)}
              className="form-control"
              id="exampleInput"
              placeholder="Totalcost"
              required
            />
          </div>
                 
          <button type="submit" className="btn btn-primary">
            Create
          </button>
      </form>
      </div>
    
  );
};

export default CreateIt;
