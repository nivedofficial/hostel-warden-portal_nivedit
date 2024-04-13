import React, {useState} from "react";
import {fetchRooms} from "../Rooms"
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";import { firestore } from '../firebaseConfig';


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
      

        const sortedStudents = students.sort((a, b) => {
            // Implement sorting logic based on the provided criteria
            // Return -1 if a should come before b, 1 if b should come before a, or 0 if equal
            // Example:
            if (a.isDisabled && !b.isDisabled) {
              return -1; // isDisabled students first
            }
            else if (!a.isDisabled && b.isDisabled) {
              return 1;
            } 
            if (a.State !== 'Kerala' && b.State === 'Kerala') {
              return -1;
          } else if (a.State === 'Kerala' && b.State !== 'Kerala') {
              return 1;
          } else if (a.State === 'Kerala' && b.State === 'Kerala') {
              if (a.AnnualIncome < b.AnnualIncome) {
                  return 1;
              } else if (a.AnnualIncome > b.AnnualIncome) {
                  return -1;
              }
          }        
            // Implement additional sorting criteria
            // Return 0 if both are equal based on the sorting criteria
            return 0;
          });

          sortedStudents.map((student)=>{
            console.log(student.Name);
          })

          const batch = writeBatch(firestore); // Create a batch object
          sortedStudents.forEach(student => {
              for (const room of rooms) {
                  if (room.occupants.length < 2) { // Check if room has space for more students
                      const studentDocRef = doc(firestore, 'Users', student.id);
                      batch.update(studentDocRef, { isAllocated: true, RoomId : room.roomId }); // Update isAllocated field for the student
                      room.occupants.push(student);
                      const roomDocRef = doc(firestore, 'Rooms', room.id);
                      batch.update(roomDocRef, { occupants: room.occupants }); // Update students array for the room
                      break;
                  }
              }
          });

          await batch.commit();

          // Log allocated students for each room
          rooms.forEach(room => {
              console.log(`Room ${room.roomId}:`);
              room.occupants.forEach(student => {
                  console.log(student.Name);
              });
          });
  
        } catch(error){
          console.error('Error Allocating students:', error);
      }
    }

    return (
        <div>
            <h2>Allocation Process</h2>
            <button onClick={allocate}>Allocate Rooms</button>
        </div>
    );

}

export default RoomAllocation;