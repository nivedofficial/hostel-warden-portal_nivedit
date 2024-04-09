import React from "react";
import { firestore } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";


export const RoomCreation = ()=>{

    const addData = async () => {
        try {
            // Access the "Users" collection and add the data
            const collectionRef = collection(firestore, "Rooms");

            for (var i=1;i<=10;i++){
                await addDoc(collectionRef, {
                    roomId : "A" + i,
                    isFilled : false,
                    occupants: []
                });
                console.log(`{i} Data added successfully to Firestore!`);
            }        
        } catch (error) {
            console.error("Error adding data to Firestore:", error);
        }
    };

    return (
        <div>
            <h2>Add Rooms to Firestore</h2>
            <button onClick={addData}>Add Rooms</button>
        </div>
    );
}