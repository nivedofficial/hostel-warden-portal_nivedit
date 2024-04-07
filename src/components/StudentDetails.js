import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './StudentDetails.css';
// import {db} from './firebase'; // Importing the Firestore instance

const StudentDetails = () => {
  const { roomNumber } = useParams();
  const [students, setStudents] = useState([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    semester: '',
    batch: '',
    disability: ''
  });

  // useEffect(() => {
  //   const fetchStudentDetails = async () => {
  //     try {
  //       const querySnapshot = await db.collection("Users").get(); // Fetching data from the "Users" collection
  //       const fetchedStudents = querySnapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //         disability: doc.data().Disability === 'Yes' ? true : false
  //       }));
  //       setStudents(fetchedStudents);
  //     } catch (error) {
  //       console.error("Error fetching students:", error);
  //     }
  //   };

  //   fetchStudentDetails();
  // }, []);

  const handleDelete = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
  };

  const toggleDeleteButtons = () => {
    setShowDeleteButtons(!showDeleteButtons);
  };

  const toggleAddUserForm = () => {
    setShowAddUserForm(!showAddUserForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudentData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStudent = { ...newStudentData, id: students.length + 1, roomNumber: roomNumber };
    setStudents([...students, newStudent]);
    setNewStudentData({
      name: '',
      age: '',
      gender: '',
      phone: '',
      address: '',
      semester: '',
      batch: '',
      disability: ''
    });
    setShowAddUserForm(false);
  };

  return (
    <div className="student-details">
      <h2>Student Details for Room {roomNumber}</h2>
      <div className="button-container">
        <button className='show-delete' onClick={toggleDeleteButtons}>{showDeleteButtons ? "Cancel" : "Delete Student"}</button>
        <div className="add-user-button-container">
          <button className='add-user' onClick={toggleAddUserForm}>Add User</button>
        </div>
      </div>
      {showAddUserForm && (
        <div className="add-user-form">
          <h3>Add New Student</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={newStudentData.name} onChange={handleInputChange} required />
            <input type="text" name="age" placeholder="DOB" value={newStudentData.age} onChange={handleInputChange} required />
            <input type="text" name="gender" placeholder="Gender" value={newStudentData.gender} onChange={handleInputChange} required />
            <input type="text" name="phone" placeholder="ContactNum" value={newStudentData.phone} onChange={handleInputChange} required />
            <input type="text" name="address" placeholder="Location" value={newStudentData.address} onChange={handleInputChange} required />
            <input type="text" name="semester" placeholder="Semester" value={newStudentData.semester} onChange={handleInputChange} required />
            <input type="text" name="batch" placeholder="Branch" value={newStudentData.batch} onChange={handleInputChange} required />
            <input type="text" name="disability" placeholder="Disability (Yes/No)" value={newStudentData.disability} onChange={handleInputChange} required />
            <div className="add-student-buttons">
              <button type="submit">Add Student</button>
              <button type="button" onClick={toggleAddUserForm} style={{ marginLeft: '10px', backgroundColor:'red' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="student-page">
        
        {students.map((student, index) => (
          <div className="student-box" key={student.id}>
            <div>
              {showDeleteButtons && <button className='delete' onClick={() => handleDelete(student.id)}>X</button>}
              <div className="image"></div>
              <div className="name">{student.name}</div>
              <div className="age">DOB: {student.age}</div>
              <div className="phone">ContactNum: {student.phone}</div>
            </div>
            <div>
              <div className="address">Location: {student.address}</div>
              <div className="semester">Semester: {student.semester}</div>
              <div className="batch">Branch: {student.batch}</div>
              <div className="disability">Disability: {student.disability ? "Yes" : "No"}</div>
              <div className="gender">Gender: {student.gender}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDetails;
