import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './Services.css';
import Rooms from './components/rooms/Rooms.js';
import NoticeBoard from './components/noticeBoard/NoticeBoard.js';
import PermissionRequest from './components/permission/PermissionRequest.js';
import AdmissionApplications from './components/Applicants/AdmissionApplications.js';
import Attendance from './components/attendance/Attendance.js';
import LaundryBooking from './components/laundry/Laundry.js';
import FeePayment from './components/Fee/Fee.js';
import HostelSettingsForm from './components/hostelSettings/HostelSettingsForm.js';
import { ReactComponent as Icon } from '../../icons-svg/icon.svg';
import { ReactComponent as RoomsIcon } from '../../icons-svg/rooms.svg';
import { ReactComponent as ApplicationIcon } from '../../icons-svg/application.svg';
import { ReactComponent as FeeIcon } from '../../icons-svg/fee.svg';
import { ReactComponent as PShuffleIcon } from '../../icons-svg/p-shuffle.svg';
import { ReactComponent as NoticeIcon } from '../../icons-svg/notice.svg';
import { ReactComponent as LaundryIcon } from '../../icons-svg/laundry.svg';
import { ReactComponent as PermissionIcon } from '../../icons-svg/permission.svg';
import { ReactComponent as AttendanceIcon } from '../../icons-svg/attendance.svg';
import { ReactComponent as LogoutIcon } from '../../icons-svg/logout.svg';
import { ReactComponent as HostelSettingsIcon } from '../../icons-svg/settings.svg';
import { getAuth, signOut } from 'firebase/auth';
import { firestore } from '../../firebaseConfig.js';
import { updateDoc, collection, getDocs } from "firebase/firestore";
import pincode from "pincode-distance";

const Services = () => {
  const [activeOption, setActiveOption] = useState('Rooms');
  // const LaundrySchedule = () => <div>Laundry Schedule Page</div>;
  // const HostelFees = () => <div>Hostel Fees Page</div>;
  const PeriodicShuffling = () => <div>Periodic Shuffling Page</div>;
  const history = useHistory();
  const Pincode = new pincode();
  const options = [
    { name: 'Rooms', component: <Rooms />, icon: <RoomsIcon className="icons-dash" /> },
    { name: 'Permission Request', component: <PermissionRequest />, icon: <PermissionIcon className="permi-icons-dash" /> },
    { name: 'Laundry Schedule', component: <LaundryBooking />, icon: <LaundryIcon className="icons-dash" /> },
    { name: 'Notice Board', component: <NoticeBoard />, icon: <NoticeIcon className="icons-dash" /> },
    { name: 'Attendance', component: <Attendance />, icon: <AttendanceIcon className="icons-dash" /> },
    { name: 'Hostel Fees', component: <FeePayment />, icon: <FeeIcon className="icons-dash" /> },
    // { name: 'Periodic Shuffling', component: <PeriodicShuffling />, icon: <PShuffleIcon className="icons-dash" /> },
    { name: 'Admission Applications', component: <AdmissionApplications />, icon: <ApplicationIcon className="icons-dash" /> },
    { name: 'Hostel Configuration', component: <HostelSettingsForm />, icon: <HostelSettingsIcon className="icons-dash" /> },
  ];

  useEffect(() => {
    // Calculate distance and update Firestore when component mounts
    calculateDistanceAndUpdateFirestore();
    // const distance = Pincode.getDistance("625147", "689121");
    // console.log(distance)
  }, []);

  const calculateDistanceAndUpdateFirestore = async () => {
    const studentsCollection = collection(firestore, 'Users'); 
    const querySnapshot = await getDocs(studentsCollection);
    querySnapshot.forEach(async (doc) => {
      const studentData = doc.data();
      // console.log(studentData.Pincode);
      const distance = await calculateDistance(studentData.Pincode); // Calculate distance using pincode-distance package
      // Update Firestore document with distance field
      await updateDoc(doc.ref, { 
        distance : distance,
        isAllocated : false,
       });
      if (studentData.isAllocated === false){
        await updateDoc(doc.ref, { 
          RoomId : ""
         });
      }
    });
  };

  const calculateDistance = async (studentPincode) => {
    const distance = Pincode.getDistance(studentPincode, "689121");
    console.log(distance);
    return distance; 
  }

  const handleOptionClick = (optionName) => {
    setActiveOption(optionName);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      history.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <div className="App">
      <Icon className='icon-logo' />   
      <div className='logo'>hms</div>
      <div className="header">
        <h1>Hostel Management Portal</h1>
        <button className='logout' onClick={handleLogout}><LogoutIcon className='icolog' />Log Out</button>
      </div>
      <div className="dashboard">
        <div className="dashboard-nav">
          {options.map((option, index) => (
            <div key={index} className={`dashboard-option ${option.name === activeOption ? 'active' : ''}`}
              onClick={() => handleOptionClick(option.name)}>
              <div className="icon-text-container">
                {option.icon}
                <span>{option.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-content">
          {options.map((option, index) => (
            option.name === activeOption && option.component
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
