import React, {useState} from "react";
import {fetchRooms} from "../Rooms"
import { collection, getDocs } from "firebase/firestore";
import { firestore } from '../firebaseConfig';


const RoomAllocation = ()=>{

    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);

    const allocate = async ()=>{
        try{           
            const studentsCollection = collection(firestore, 'Users'); 
            const querySnapshot1 = await getDocs(studentsCollection);
            const fetchedStudents = querySnapshot1.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
            setStudents(fetchedStudents);

            const fetchedRooms = await fetchRooms();
            setRooms(fetchedRooms);
        } catch(error){
            console.error('Error Allocating students:', error);
        }

        const sortedStudents = students.sort((a, b) => {
            // Implement sorting logic based on the provided criteria
            // Return -1 if a should come before b, 1 if b should come before a, or 0 if equal
            // Example:
            if (a.isDisabled && !b.isDisabled) {
              return -1; // isDisabled students first
            }
            if (!a.isDisabled && b.isDisabled) {
              return 1;
            } 
            if(a.State !='Kerala' && b.State == 'Kerala'){ return -1;}
            if(a.State =='Kerala' && b.State != 'Kerala'){ return 1;}
            



            // Implement additional sorting criteria
            // Return 0 if both are equal based on the sorting criteria
            return 0;
          });

          sortedStudents.map((student)=>{
            console.log(student);
          })


    }

    return (
        <div>
            <h2>Allocation Process</h2>
            <button onClick={allocate}>Allocate Rooms</button>
        </div>
    );

}

export default RoomAllocation;