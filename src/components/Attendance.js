import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import './Attendance.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(firestore, 'Users'); // Assuming 'Users' is the collection name
        const querySnapshot = await getDocs(studentsCollection);
        const fetchedStudents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(fetchedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const markAttendance = async (studentId, present) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in yyyy-mm-dd format
      const attendanceRef = doc(firestore, 'attendance', today);
      const attendanceDoc = await getDocs(attendanceRef);
      
      if (attendanceDoc.exists()) {
        await setDoc(attendanceRef, { [studentId]: present }, { merge: true }); // Merge new attendance with existing
      } else {
        await setDoc(attendanceRef, { [studentId]: present }); // Create new attendance document
      }
      alert(`Attendance marked for student with ID ${studentId}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <div className="attendance-page">
      <h2>Attendance</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.Name}</td>
              <td>
                <label>
                  Present
                  <input
                    type="checkbox"
                    onChange={e => markAttendance(student.id, e.target.checked)}
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
