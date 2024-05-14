import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import './StudentDetails.css';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../../../firebaseConfig'; // Importing the Firestore instance
import Delete from '../../../../../../icons-svg/delete.svg'

const StudentDetails = (props) => {
  const roomNumber  = props.roomId;
  const [students, setStudents] = useState([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const history = useHistory();
  // const [showAddUserForm, setShowAddUserForm] = useState(false);
  // const [newStudentData, setNewStudentData] = useState({
  //   name: '',
  //   age: '',
  //   gender: '',
  //   phone: '',
  //   address: '',
  //   semester: '',
  //   batch: '',
  //   disability: ''
  // });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const roomRef = collection(firestore, 'Rooms');
        const roomSnapshot = await getDocs(roomRef);
        roomSnapshot.forEach(roomDoc => {
          const roomData = roomDoc.data();
          if (roomData.roomId === roomNumber) {
            setStudents(roomData.occupants);
          }
        });
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudentDetails();
  }, [students]);

  const handleBack = () => {
    history.push('/services');// Navigate back to the previous page
  };

  // const handleDelete = (id) => {
  //   const updatedStudents = students.filter(student => student.id !== id);
  //   setStudents(updatedStudents);
  // };

  // const toggleDeleteButtons = () => {
  //   setShowDeleteButtons(!showDeleteButtons);
  // };

  // const toggleAddUserForm = () => {
  //   setShowAddUserForm(!showAddUserForm);
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewStudentData(prevData => ({
  //     ...prevData,
  //     [name]: value
  //   }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newStudent = { ...newStudentData, id: students.length + 1, roomNumber: roomNumber };
  //   setStudents([...students, newStudent]);
  //   setNewStudentData({
  //     name: '',
  //     age: '',
  //     gender: '',
  //     phone: '',
  //     address: '',
  //     semester: '',
  //     batch: '',
  //     disability: ''
  //   });
  //   setShowAddUserForm(false);
  // };

  return (
    <div className="student-details">
      <h2>Student Details for Room {roomNumber}</h2>
      

      <div className="student-page">
      {students.map(student => (
        <div className="student-box" key={student.id}>
          <div className="image"></div>
          <div className="name">{student.Name}</div>
          {/* <div className='delete'>
            <img src={Delete} alt="" />
          </div> */}
          <div className='details'>
            <div className="admission-num"><span >Admission Number:</span> <span className="field-value">{student.AdmissionNum}</span></div>
            <div className="annual-income"><span >Annual Income:</span> <span className="field-value">{student.AnnualIncome}</span></div>
            <div className="branch1"><span >Branch:</span> <span className="field-value">{student.Branch}</span></div>
            <div className="contact-num"><span >Contact Number:</span> <span className="field-value">{student.ContactNum}</span></div>
            <div className="dob"><span >Date of Birth:</span> <span className="field-value">{student.DOB}</span></div>
            <div className="distance"><span >Distance from College:</span> <span className="field-value">{student.distance}</span></div>
            <div className="email"><span >Email:</span> <span className="field-value">{student.Email}</span></div>
            <div className="emergency-contact"><span >Emergency Contact:</span> <span className="field-value">{student.EmergencyContact}</span></div>
            <div className="guardian-name"><span >Guardian Name:</span> <span className="field-value">{student.GuardianName}</span></div>
            <div className="guardian-relation"><span >Guardian Relation:</span> <span className="field-value">{student.GuardianRelation}</span></div>
            <div className="address"><span >Address</span> <span className="field-value">{student.Address}</span></div>
            <div className="city"><span >City:</span> <span className="field-value">{student.City}</span></div>
            <div className="state"><span >State:</span> <span className="field-value">{student.State}</span></div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default StudentDetails;
