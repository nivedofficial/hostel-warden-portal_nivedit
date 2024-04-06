// src/components/Rooms.js
import React, { useState, useEffect } from 'react';
import './Room.css';
import { Link } from 'react-router-dom';

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
  // State to store room data
  const [rooms, setRooms] = useState([]);

  // Fetch room data from database
  useEffect(() => {
    // Your fetch logic here
    // For example:
    // fetch('your-api-endpoint')
    //   .then(response => response.json())
    //   .then(data => setRooms(data));
    // Replace 'your-api-endpoint' with your actual API endpoint to fetch room data
    // Ensure that the data fetched matches the structure expected by your component
    // For now, using dummy data
    const dummyData = [
      { roomNo: 'A1' },
      { roomNo: 'A2' },
      { roomNo: 'A3' },
      // Add more rooms as needed
    ];
    setRooms(dummyData);
  }, []); // Empty dependency array to ensure useEffect runs only once

  return (
    <div className='room_page'>
      <div className='room-heading'>ROOMS</div>
      {/* Map over room data to dynamically generate room components */}
      {rooms.map((room, index) => (
        <div className="room" key={index}>
          <div className="room_no">{room.roomNo}</div>
          <div className="stu_mai">
            {/* Link to dynamic routes based on room number */}
            <Link to={`/student-info/${room.roomNo}`} className="stu_data">Students Data</Link>
            <a href="/maintanence" className="maintanence">Maintanence</a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Rooms;
