import React, { useEffect, useState } from 'react';
import { collection, getDoc, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
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
        const querySnapshot = await getDocs(studentsCollection);
        const fetchedStudents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          present: null // Initialize present state to null
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

  try {
    const userRef = doc(firestore, 'Users', studentId);
    const userDoc = await getDoc(userRef);
    let consecutiveDaysAbsent = userDoc.data().consecutiveDaysAbsent;
    let consecutive5DaysAbsent = userDoc.data().consecutive5DaysAbsent;

    if (present === false) {
      // If student is absent, increment consecutiveDaysAbsent locally
      consecutiveDaysAbsent++;
      if (consecutiveDaysAbsent >= 5) {
        // Reset consecutiveDaysAbsent and increment consecutive5DaysAbsent
        consecutiveDaysAbsent = 0;
        consecutive5DaysAbsent++;
      }
      // Update the document with the new values
      await updateDoc(userRef, {
        consecutiveDaysAbsent,
        consecutive5DaysAbsent
      });
      console.log('Consecutive days absent incremented for student:', studentId);
    } else if (present === true) {
      // If student is present, reset consecutiveDaysAbsent to 0
      await updateDoc(userRef, {
        consecutiveDaysAbsent: 0
      });
      console.log('Consecutive days absent reset for student:', studentId);
    }
  } catch (error) {
    console.error('Error updating consecutiveDaysAbsent:', error);
  }
};

  const handleSubmitAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceRef = doc(firestore, 'Attendance', today);
      console.log(today)
      const attendanceDoc = await getDoc(attendanceRef);

      const attendanceData = students.reduce((acc, student) => {
        acc[student.id] = student.present !== null ? student.present : false;
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
                    checked={student.present === true}
                    onChange={() => markAttendance(student.id, true)}
                  />
                </label>
                <label>
                  Absent
                  <input
                    type="checkbox"
                    checked={student.present === false}
                    onChange={() => markAttendance(student.id, false)}
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
