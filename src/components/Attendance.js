import React, { useEffect, useState } from 'react';
import { collection, getDoc,getDocs, doc, setDoc,updateDoc,increment } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import './Attendance.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(firestore, 'Users');
        const querySnapshot = await getDocs(studentsCollection); // Fix this line
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
    // Update the attendance for the student in the local state
    setStudents(prevStudents =>
        prevStudents.map(student =>
            student.id === studentId ? { ...student, present } : student
        )
    );

    const userRef = doc(firestore, 'Users', studentId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            let updatedAbsentDays = userData.consecutiveDaysAbsent || 0;
            if (!present) {
                // Student is absent, increment consecutiveDaysAbsent
                updatedAbsentDays += 1;
            } else {
                // Student is present, reset consecutiveDaysAbsent if it's >= 5
                if (updatedAbsentDays >= 5) {
                    updatedAbsentDays = 0;
                }
            }
            // Update the consecutiveDaysAbsent field
            await updateDoc(userRef, { consecutiveDaysAbsent: updatedAbsentDays });
            console.log('Consecutive days absent updated successfully.');
        } else {
            console.error('User document does not exist');
        }
    } catch (error) {
        console.error('Error updating consecutiveDaysAbsent:', error);
    }
};

  const handleSubmitAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceRef = doc(firestore, 'Attendance', today);
      const attendanceDoc = await getDoc(attendanceRef);

      const attendanceData = students.reduce((acc, student) => {
        acc[student.id] = student.present || false;
        return acc;
      }, {});

      if (!attendanceDoc.exists()) {
        await setDoc(attendanceRef, attendanceData);
        setAttendanceSubmitted(true);
        setAttendanceMessage('Attendance submitted successfully!');
      } else {
        setAttendanceMessage('Attendance for today has already been submitted.');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
    }
  };

  return (
    <div className="attendance-page">
      <h2>Attendance</h2>
      {attendanceMessage && <p className="attendance-message">{attendanceMessage}</p>}
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
      <button onClick={handleSubmitAttendance} disabled={attendanceSubmitted}>
        Submit Attendance
      </button>
    </div>
  );
};

export default Attendance;

