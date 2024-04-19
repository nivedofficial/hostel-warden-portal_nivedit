import React, {useState} from "react";
import {fetchRooms} from "../Rooms"
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
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

            const nonAllocatedStudents = students.filter(student => !student.isAllocated);
      

            const sortedStudents = nonAllocatedStudents.sort((a, b) => {
                // Sort disabled students first
                if (a.isDisabled && !b.isDisabled) {
                    return -1;
                } else if (!a.isDisabled && b.isDisabled) {
                    return 1;
                }
            
                // Sort by state: Kerala first
                if (a.State !== 'Kerala' && b.State === 'Kerala') {
                    return -1;
                } else if (a.State === 'Kerala' && b.State !== 'Kerala') {
                    return 1;
                }
            
                // For students with distance greater than 30, sort by annual income
                if (a.distance > 30 && b.distance > 30) {
                    if (a.AnnualIncome < b.AnnualIncome) {
                        return 1;
                    } else if (a.AnnualIncome > b.AnnualIncome) {
                        return -1;
                    }
                } 
                else if (a.distance > 30 && b.distance < 30){
                    return -1;
                }
                else if(a.distance < 30 && b.distance > 30 ){
                    return 1;
                }
                else {
                    // For students with distance less than or equal to 30, sort by distance
                    if (a.distance < b.distance) {
                        return 1;
                    } else if (a.distance > b.distance) {
                        return -1;
                    }
                }
            
                // Add fallback conditions or handle equality cases if needed
            
                // If all sorting criteria are equal, maintain original order
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
                      student.isAllocated = true;
                      student.RoomId = room.roomId;
                      room.occupants.push(student);
                      room.isFilled = (room.occupants.length == 2) ? true : false ;
                      const roomDocRef = doc(firestore, 'Rooms', room.id);
                      batch.update(roomDocRef, { occupants: room.occupants, isFilled : room.isFilled }); // Update students array for the room
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
          alert("Room Allocation Completed");
        } catch(error){
          console.error('Error Allocating students:', error);
      }
    }

    return (
        <div >
            <h2>Allocation Process</h2>
            <button onClick={allocate}>Allocate Rooms</button>
        </div>
    );

}

export default RoomAllocation;