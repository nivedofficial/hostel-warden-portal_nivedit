import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentDetails.css';

const PermissionRequest = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Dummy data
    const dummyData = [
      {
        id: 1,
        name: 'John Doe',
        age: 20,
        phone: '123-456-7890',
        address: '123 Main St, Anytown',
        semester: '3rd',
        batch: 'A',
        reason: 'Scholarship',
        roomNumber: 'A1', // Example room number
        status: '', // Initially no status
      },
      {
        id: 2,
        name: 'Jane Smith',
        age: 19,
        phone: '987-654-3210',
        address: '456 Elm St, Anytown',
        semester: '2nd',
        batch: 'D',
        reason: 'Transfer',
        roomNumber: 'A2', // Example room number
        status: '', // Initially no status
      },
      // Add more student data as needed
    ];

    setStudents(dummyData);
  }, []);

  const handleAccept = (id) => {
    // Update the status of the student with the given id to 'Accepted'
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, status: 'Accepted' } : student
    );
    setStudents(updatedStudents);
  };

  const handleReject = (id) => {
    // Update the status of the student with the given id to 'Rejected'
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, status: 'Rejected' } : student
    );
    setStudents(updatedStudents);
  };

  return (
    <div className="student-page">
      {students.map(student => (
        <div className="student-box" key={student.id}>
          <div>
            <div className="image"></div>
            <div className="name">{student.name}</div>
            <div className="age">Age: {student.age}</div>
            <div className="phone">Ph no: {student.phone}</div>
            <div className="address">Address: {student.address}</div>
            <div className="semester">Semester: {student.semester}</div>
            <div className="batch">Batch: {student.batch}</div>
            <div className="disability">Disability: {student.disability ? "Yes" : "No"}</div>
            <div className="gender">Reason: {student.reason}</div>
          </div>
          <div className="action-buttons">
            {student.status === '' && (
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
