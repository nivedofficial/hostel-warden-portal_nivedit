import React, { useState, useEffect } from "react";
import { firestore } from "../../../../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const RoomCreation = () => {
  const [hostel, setHostel] = useState([]);
  const [status, setStatus] = useState(true);
  const [roomsAdded, setRoomsAdded] = useState(false); // State to track if rooms are added

  useEffect(() => {
    const fetchHostelData = async () => {
      try {
        const db = firestore;
        const wardenCollection = collection(db, 'Warden'); 
        const querySnapshot1 = await getDocs(wardenCollection);
        const fetchedHostel = querySnapshot1.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHostel(fetchedHostel);
      } catch (error) {
        console.error("Error fetching hostel data:", error);
      }
    };

    fetchHostelData();
  }, [status]); 

  const addData = async () => {
    try {
      const db = firestore;
      const collectionRef = collection(db, "Rooms");

      // Fetch existing rooms from Firestore
      const existingRoomsSnapshot = await getDocs(collectionRef);
      const existingRoomIds = existingRoomsSnapshot.docs.map(doc => doc.data().roomId);

      const roomsToAdd = [];
      for (const item of hostel) {
        for (let i = 1; i <= item.NoOfFloors; i++) {
          for (let j = 1; j <= item.NoOfRoomsInEachFloor; j++) {
            const roomId = String.fromCharCode(64 + i) + j;

            if (!existingRoomIds.includes(roomId)) {
              roomsToAdd.push({
                roomId: roomId,
                isFilled: false,
                occupants: []
              });
            } else {
              console.log(`${roomId} already exists in Firestore, skipping...`);
            }
          }
        }
      }
      
      const batch = firestore.batch(); // Use batch operation to improve performance
      roomsToAdd.forEach(async room => {
        const docRef = collectionRef.doc();
        batch.set(docRef, room);
        console.log(`${room.roomId} Data added successfully to Firestore!`);
      });

      await batch.commit(); // Commit the batch

      // Update state to indicate rooms are added
      setRoomsAdded(true);
      setStatus(false);
    } catch (error) {
      console.error("Error adding data to Firestore:", error);
    }
  };

  // Show alert only if rooms are added successfully and console logging is done
  useEffect(() => {
    if (roomsAdded) {
      alert("Rooms are created successfully!");
    }
  }, [roomsAdded]);

  return (
    <div>
      {status && (
        <div>
          <h2>Room Creation</h2>
          <button onClick={addData} style={{ padding: '10px' }}>Add Rooms</button>
        </div>
      )}
    </div>
  );
};

export default RoomCreation;
