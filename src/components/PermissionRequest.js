import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from './firebaseConfig'; // Import your Firestore configuration
import './permission.css';

const PermissionRequest = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(firestore, 'permissions');
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsData = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students: ', error);
      }
    };

    fetchStudents();
  }, []);

  const handleAccept = async (id) => {
    try {
      const studentRef = doc(firestore, 'permissions', id);
      await updateDoc(studentRef, { status: 'Accepted' });
      setStudents(prevStudents => 
        prevStudents.map(student =>
          student.id === id ? { ...student, status: 'Accepted' } : student
        )
      );
    } catch (error) {
      console.error('Error accepting student: ', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const studentRef = doc(firestore, 'permissions', id);
      await updateDoc(studentRef, { status: 'Rejected' });
      setStudents(prevStudents => 
        prevStudents.map(student =>
          student.id === id ? { ...student, status: 'Rejected' } : student
        )
      );
    } catch (error) {
      console.error('Error rejecting student: ', error);
    }
  };

  return (
    <div className="student-page">
      {students.map(student => (
        <div className="student-box1" key={student.id}>
          <div>
            <div className="image"></div>
            <div className="name">{student.name && <span className="bold">{student.name}</span>}</div>
            <div className="branch">Branch: {student.branch && <span className="bold">{student.branch}</span>}</div>
            <div className="semester">Semester: {student.semester && <span className="bold">{student.semester}</span>}</div>
            <div className="start-time">Start Time: {student.start_time && <span className="bold">{student.start_time}</span>}</div>
            <div className="end-time">End Time: {student.end_time && <span className="bold">{student.end_time}</span>}</div>
            <div className="request">Request: {student.request && <span className="bold">{student.request}</span>}</div>
         </div>

          <div className="action-buttons">
            {student.status !== 'Accepted' && student.status !== 'Rejected' && (
              <div>
                <button className="accept-button" onClick={() => handleAccept(student.id)}>Accept</button>
                <button className="reject-button" onClick={() => handleReject(student.id)}>Reject</button>
              </div>
            )}
            {student.status === 'Accepted' && <div className='status'>Status: <span className="accepted-status">Accepted</span></div>}
            {student.status === 'Rejected' && <div className='status'>Status: <span className="rejected-status">Rejected</span></div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionRequest;
