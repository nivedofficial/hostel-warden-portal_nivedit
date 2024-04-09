// src/components/Rooms.js
import React, { useState, useEffect } from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
// import { firestore } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { RoomCreation } from './roomCreation/roomCreation';


// const RoomDetails = ({ roomNumber }) => {
//   // You can fetch room details based on roomNumber from your data source
//   // For now, let's use placeholder content
//   const placeholderContent = `Details for Room ${roomNumber}`;

//   return <div>{placeholderContent}</div>;
// };

// const Room = ({ roomNumber }) => {
//   return (
//     <Link to={`/rooms/${roomNumber}`}>
//       <div className="room-division">
//         <span>Room {roomNumber}</span>
//         <div className="arrow-mark">&#8594;</div>
//       </div>
//     </Link>
//   );
// };

const Rooms = () => {

  return (
    <div className='room_page'>
      <div className='room-heading'>ROOMS</div>
      {/* Map over room data to dynamically generate room components */}
{/* 
      {rooms.map((room, index) => (
        <div className="room" key={index}>
          <div className="room_no">{room.roomNo}</div>
          <div className="stu_mai">
            {/* Link to dynamic routes based on room number */}
            {/* <Link to={`/student-info/${room.roomNo}`} className="stu_data">Students Data</Link>
            <a href="/maintanence" className="maintanence">Maintanence</a>
          </div>
        </div>
      ))}  */}
      <RoomCreation/>
    </div>
  );
};

export default Rooms;
