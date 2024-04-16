import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import './StudentDetails.css';
import pincode from "pincode-distance"


const AdmissionApplications = () => {
  const [students, setStudents] = useState([]);
  const Pincode = new pincode();
  const distance = Pincode.getDistance("689121","690514" );
  console.log('Distance is :', distance);


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

  return (
    <div className="student-page">
      {students.map(student => (
        <div className="student-box" key={student.id}>
          <div className="image"></div>
          <div className="name">{student.Name}</div>
          <div className='details'>
            <div className="admission-num"><span >Admission Number:</span> <span className="field-value">{student.AdmissionNum}</span></div>
            <div className="annual-income"><span >Annual Income:</span> <span className="field-value">{student.AnnualIncome}</span></div>
            <div className="branch1"><span >Branch:</span> <span className="field-value">{student.Branch}</span></div>
            <div className="contact-num"><span >Contact Number:</span> <span className="field-value">{student.ContactNum}</span></div>
            <div className="dob"><span >Date of Birth:</span> <span className="field-value">{student.DOB}</span></div>
            <div className="distance"><span >Distance from College:</span> <span className="field-value">{student.Distance}</span></div>
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
  );
};

export default AdmissionApplications;
