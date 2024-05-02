import React, { useState } from "react";
import { firestore } from "../../../../../firebaseConfig";
import { collection, addDoc, getDocs} from "firebase/firestore";


export const RoomCreation = ()=>{

    const [hostel,setHostel]= useState([]);

    const addData = async () => {
        try {
            // Access the "Users" collection and add the data
            const collectionRef = collection(firestore, "Rooms");

            const wardenCollection = collection(firestore, 'Warden'); 
            const querySnapshot1 = await getDocs(wardenCollection);
            const fetchedHostel = querySnapshot1.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
            setHostel(fetchedHostel);
            hostel.map(async (item)=>{
                for(var i=0;i<item.NoOfFloors;i++){
                    for(var j=1;j<=item.NoOfRoomsInEachFloor;j++){
                        if(i==1){
                            await addDoc(collectionRef, {
                                roomId : "A" + j,
                                isFilled : false,
                                occupants: []
                            });
                            console.log(`{i} Data added successfully to Firestore!`);            
                        }
                        else{
                            await addDoc(collectionRef, {
                                roomId : "B" + j,
                                isFilled : false,
                                occupants: []
                            });
                            console.log(`{i} Data added successfully to Firestore!`);

                        }

                    }
                }
                alert("Room Created Successfully");
            })
        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }
    };

    return (
        <div>
            <h2>Add Rooms to Firestore</h2>
            <button onClick={addData} style={{padding:'10px'}}>Add Rooms</button>
        </div>
    );
}