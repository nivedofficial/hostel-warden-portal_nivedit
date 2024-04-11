import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import './Attendance.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(firestore, 'Users');
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
      const today = new Date().toISOString().split('T')[0];
      const attendanceRef = doc(firestore, 'attendance', today);
      const attendanceDoc = await getDocs(attendanceRef);

      const attendanceData = {
        [studentId]: present
      };

      if (attendanceDoc.exists()) {
        await setDoc(attendanceRef, { ...attendanceDoc.data(), ...attendanceData });
      } else {
        await setDoc(attendanceRef, attendanceData);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleSubmitAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceRef = doc(firestore, 'attendance', today);
      const attendanceDoc = await getDocs(attendanceRef);
      
      if (!attendanceDoc.exists()) {
        alert('No attendance recorded for today!');
        return;
      }

      alert('Attendance submitted successfully!');
      setAttendanceSubmitted(true);
    } catch (error) {
      console.error('Error submitting attendance:', error);
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
      <button onClick={handleSubmitAttendance} disabled={attendanceSubmitted}>Submit Attendance</button>
    </div>
  );
};

export default Attendance;
