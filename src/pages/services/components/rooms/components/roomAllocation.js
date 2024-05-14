import React, {useState} from "react";
import {fetchRooms} from "../Rooms"
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { firestore } from '../../../../../firebaseConfig';


const RoomAllocation = ()=>{

    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [hostel, setHostel] = useState([]);

  
    const allocate = async () => {
        try {
          const wardenCollection = collection(firestore, 'Warden'); 
          const wardenSnapshot = await getDocs(wardenCollection);
          const fetchedHostel = wardenSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));  
          setHostel(fetchedHostel);
      
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
            // Sorting logic here
          });
      
          const batch = writeBatch(firestore);
          sortedStudents.forEach(student => {
            for (const room of rooms) {
              if (room.occupants.length < hostel[0].CapacityOfEachRoom) {
                const studentDocRef = doc(firestore, 'Users', student.id);
                batch.update(studentDocRef, { isAllocated: true, RoomId : room.roomId });
                student.isAllocated = true;
                student.RoomId = room.roomId;
                room.occupants.push(student);
                room.isFilled = (room.occupants.length === hostel[0].CapacityOfEachRoom);
                const roomDocRef = doc(firestore, 'Rooms', room.id);
                batch.update(roomDocRef, { occupants: room.occupants, isFilled : room.isFilled });
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
      
          // Check if any students are allocated
          const allocatedStudentsCount = rooms.reduce((total, room) => total + room.occupants.length, 0);
          if (allocatedStudentsCount > 0) {
            alert("Room Allocation Completed");
          }
        } catch(error) {
          alert('Error Allocating students:');
        }
      }
      

    return (
        <div style={{marginLeft:'50px',padding:'10px',width: '131px',height: '48px',marginTop:'15px'}}>
            {/* <h2>Allocation Process</h2> */}
            <button onClick={allocate} style={{padding:'10px'}}>Allocate Rooms</button>
        </div>
    );

}

export default RoomAllocation;