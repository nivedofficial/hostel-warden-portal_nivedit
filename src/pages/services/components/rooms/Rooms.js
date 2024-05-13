import { useState, useEffect } from 'react';
import './Room.css';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { RoomCreation } from './components/roomCreation';
import { firestore } from '../../../../firebaseConfig';
import RoomAllocation from './components/roomAllocation';
import StudentDetails from './components/StudentDetails/StudentDetails';
import { Maintanence } from '../../../../components/maintanence';

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
  const [isvisible, SetIsvisible] = useState({ bool: true, roomId: "" });
  const [maintenanceClicked, setMaintenanceClicked] = useState(false);
  const [maintenanceRoomId, setMaintenanceRoomId] = useState(""); // State to store roomId for maintenance

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

  const handleVisibility = (roomId) => {
    SetIsvisible({
      bool: false,
      roomId: roomId,
    });
  }

  const handleMaintenance = (roomId) => { // Update handleMaintenance to accept roomId
    setMaintenanceRoomId(roomId); // Set the roomId for maintenance
    setMaintenanceClicked(true);
  }

  const handleBack = () => {
    setMaintenanceClicked(false);
  };

  return (
    <div >
      <div >
        {!maintenanceClicked && (
          <div>
            {isvisible.bool ? (
              <div className='room_page'>
                <RoomCreation/>
                <RoomAllocation/>               
                <div className='room-heading'>ROOMS</div>
                
                {rooms.map(room => (
                  <div className="room" key={room.id}>
                    <div className="room_no">{room.roomId}</div>
                    <div className="stu_mai">
                      <div className="stu_data" onClick={() => handleVisibility(room.roomId)}>Students Data</div>
                      <div className="maintanence" onClick={() => handleMaintenance(room.roomId)}>Maintanence</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <StudentDetails roomId={isvisible.roomId} />
            )}
          </div>
        )}  
        {/* Render MaintenanceComponent if maintenance link is clicked */}
        {maintenanceClicked && <Maintanence roomId={maintenanceRoomId} handleBack={handleBack} />} {/* Pass maintenanceRoomId */}
      </div>
    </div>
  );
};

export default Rooms;
