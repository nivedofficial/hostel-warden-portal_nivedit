import { useState, useEffect } from 'react';
import './Room.css';
import './components/StudentDetails/StudentDetails.css'
import { collection, getDocs } from "firebase/firestore";
import { RoomCreation } from './components/roomCreation';
import { firestore } from '../../../../firebaseConfig';
import RoomAllocation from './components/roomAllocation';
import StudentDetails from './components/StudentDetails/StudentDetails';
import { Maintanence } from '../../../../components/maintanence';
import Delete from '../../../../icons-svg/delete.svg'

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
  }, [rooms]);

  const handleVisibility = (roomId) => {
    SetIsvisible({
      bool: false,
      roomId: roomId,
    });
  }

  const handleMaintenance = (roomId) => {
    setMaintenanceRoomId(roomId);
    setMaintenanceClicked(true);
  }

  const handleBack = () => {
    setMaintenanceClicked(false);
  };

  const groupRoomsByFloor = (rooms) => {
    const groupedRooms = {};
    rooms.forEach(room => {
      const prefix = room.roomId.charAt(0);
      if (!groupedRooms[prefix]) {
        groupedRooms[prefix] = [];
      }
      groupedRooms[prefix].push(room);
    });

    // Map prefixes to floor names
    const floorNames = {
      A: 'Floor A',
      B: 'Floor B',
      C: 'Floor C',
      D: 'Floor D',
      E: 'Floor E',
      F: 'Floor F',

      // Add more floor names as needed
    };

    // Convert grouped rooms to floor-based groups
    const groupedRoomsByFloor = {};
    for (const [prefix, rooms] of Object.entries(groupedRooms)) {
      const floorName = floorNames[prefix];
      if (!groupedRoomsByFloor[floorName]) {
        groupedRoomsByFloor[floorName] = [];
      }
      groupedRoomsByFloor[floorName].push(...rooms);
    }

    return groupedRoomsByFloor;
  };

  const renderRoomGroups = (groupedRooms) => {
    return Object.entries(groupedRooms).map(([floorName, rooms]) => (
      <div className="room-group" key={floorName}>
        <div className="group-heading">{floorName}</div>
        <div className="rooms">
          {rooms.map(room => (
            <div className="room" key={room.id}>
              <div className="room_no">{room.roomId}</div>
              <div className="stu_mai">
                <div className="stu_data" onClick={() => handleVisibility(room.roomId)}>Students Data</div>
                <div className="maintenance" onClick={() => handleMaintenance(room.roomId)}>Maintenance</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div>      
      <div>
        {/* Check if rooms array is empty */}
        {rooms.length === 0 ? (
          <div>
            <p>No rooms available. Please go to Hostel Settings and create rooms.</p>
            {/* Render RoomCreation component or link to Room Settings */}
          </div>
        ) : (
          <div>
            {!maintenanceClicked && (
              <div>
                {isvisible.bool ? (
                  <div>
                    <div className='room_page'>
                      {/* <RoomCreation/> */}
                      <div className='room-heading'>
                        <p>ROOMS</p>
                        <RoomAllocation/> 
                      </div>
                      {/* Group rooms by floor and render each group */}
                      {renderRoomGroups(groupRoomsByFloor(rooms))}
                    </div>
                  </div>
                ) : (
                  <StudentDetails roomId={isvisible.roomId} />
                )}
              </div>
            )}
            {/* Render MaintenanceComponent if maintenance link is clicked */}
            {maintenanceClicked && <Maintanence roomId={maintenanceRoomId} handleBack={handleBack} />}
          </div>
        )}
      </div>  
    </div>
  );
};

export default Rooms;
