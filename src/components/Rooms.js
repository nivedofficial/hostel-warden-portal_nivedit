import { useState, useEffect } from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { RoomCreation } from './roomCreation/roomCreation';
import { firestore } from './firebaseConfig';
import RoomAllocation from './roomCreation/roomAllocation';
import StudentDetails from './StudentDetails';

export const fetchRooms = async () => {
  try {
    const roomsCollection = collection(firestore, 'Rooms');
    const querySnapshot = await getDocs(roomsCollection);
    const fetchedRooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    fetchedRooms.sort((a, b) => {
      // Extract the numeric portion of the roomId string
      const [prefixA, numericA] = a.roomId.match(/([A-Z]+)(\d+)/).slice(1);
      const [prefixB, numericB] = b.roomId.match(/([A-Z]+)(\d+)/).slice(1);

      // Compare the numeric portion
      if (prefixA < prefixB) return -1;
      if (prefixA > prefixB) return 1;

     // If prefixes are equal, compare the numeric portion
      return parseInt(numericA) - parseInt(numericB);

    });
    return fetchedRooms;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error; // Rethrow the error to handle it outside
  }
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isvisible, SetIsvisible] = useState({bool:true,roomId:""});

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const fetchedRooms = await fetchRooms();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Error loading rooms:', error);
      }
    };
    loadRooms();
  }, []);

  const handleVisibility = (roomId)=>{
    SetIsvisible({
      bool : false,
      roomId: roomId,
    });
  }

  return (
  
    <div >
      {isvisible.bool ? (
        <div className='room_page'>
          <RoomAllocation />
          <div className='room-heading'>ROOMS</div>
          {rooms.map(room => (
            <div className="room" key={room.id}>
              <div className="room_no">{room.roomId}</div>
              <div className="stu_mai">
                {/* Link to dynamic routes based on room number */}
                <div className="stu_data" onClick={() => handleVisibility(room.roomId)}>Students Data</div>
                <a href="/maintanence" className="maintanence">Maintanence</a>
              </div>
            </div>
          ))} 
          {/* <RoomCreation/> */}

        </div>
      ): (
        <StudentDetails roomId = {isvisible.roomId} />
      )}
      
    </div>
  );
};

export default Rooms;
