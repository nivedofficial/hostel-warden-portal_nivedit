import { useState, useEffect } from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { RoomCreation } from './roomCreation/roomCreation';
import { firestore } from './firebaseConfig';
import RoomAllocation from './roomCreation/roomAllocation';

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
      const numericA = parseInt(a.roomId.match(/\d+/)[0]);
      const numericB = parseInt(b.roomId.match(/\d+/)[0]);

      // Compare the numeric portion
      if (numericA < numericB) return -1;
      if (numericA > numericB) return 1;

      // If numeric portions are equal, compare the whole string
      return a.roomId.localeCompare(b.roomId);
    });
    return fetchedRooms;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error; // Rethrow the error to handle it outside
  }
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

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

  return (
    <div className='room_page'>
      <RoomAllocation/>
      <div className='room-heading'>ROOMS</div>
      {rooms.map(room => (
        <div className="room" key={room.id}>
          <div className="room_no">{room.roomId}</div>
          <div className="stu_mai">
            {/* Link to dynamic routes based on room number */}
            <Link to={`/student-info/${room.roomId}`} className="stu_data">Students Data</Link>
            <a href="/maintanence" className="maintanence">Maintanence</a>
          </div>
        </div>
      ))}
      {/* <RoomCreation/> */}
    </div>
  );
};

export default Rooms;
