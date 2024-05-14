import React, { useState, useEffect } from "react";
import { firestore } from "../../../../../firebaseConfig";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";

export const RoomCreation = ()=>{

    const [hostel, setHostel] = useState([]);
    const [status,setStatus] = useState(true)

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
    }, [status]); // Empty dependency array ensures the effect runs only once

    const addData = async () => {
        try {
            const db = firestore;
            const collectionRef = collection(db, "Rooms");
        
            // Fetch existing rooms from Firestore
            const existingRoomsSnapshot = await getDocs(collectionRef);
            const existingRoomIds = existingRoomsSnapshot.docs.map(doc => doc.data().roomId);
            console.log(existingRoomIds);
        
            // Extract the first item of the hostel array
            const firstHostel = hostel.length > 0 ? hostel[0] : null;
        
            const roomsToAdd = [];
            if (firstHostel) {
                for (let i = 1; i <= firstHostel.NoOfFloors; i++) {
                    for (let j = 1; j <= firstHostel.NoOfRoomsInEachFloor; j++) {
                        const roomId = String.fromCharCode(64 + i) + j;
        
                        if (!existingRoomIds.includes(roomId)) {
                            roomsToAdd.push({
                                roomId: roomId,
                                isFilled: false,
                                occupants: []
                            });
                        }
                        else {
                            console.log(`${roomId} already exists in Firestore, skipping...`);
                        }
                    }
                }
            }
        
            // Add only the new rooms that are not already in Firestore
            for (const room of roomsToAdd) {
                await addDoc(collectionRef, room);
                console.log(`${room.roomId} Data added successfully to Firestore!`);
            }
        
            setStatus(false);
        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }
    };
        

    return (
        <div>
            { status &&
                <div>
                    <h2>Room Creation </h2>
                    <button onClick={addData} style={{padding:'10px'}}>Add Rooms</button>
                </div>
            }
        </div>
    );
}
