import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import './Services.css';
import Rooms from './Rooms';
import StudentDetails from './StudentDetails';
import NoticeBoard from './NoticeBoard';
import { ReactComponent as Icon } from './icons-svg/icon.svg';
import { ReactComponent as RoomsIcon } from './icons-svg/rooms.svg';
import { ReactComponent as ApplicationIcon } from './icons-svg/application.svg';
import { ReactComponent as FeeIcon } from './icons-svg/fee.svg';
import { ReactComponent as PShuffleIcon } from './icons-svg/p-shuffle.svg';
import { ReactComponent as NoticeIcon } from './icons-svg/notice.svg';
import { ReactComponent as LaundryIcon } from './icons-svg/laundry.svg';
import { ReactComponent as PermissionIcon } from './icons-svg/permission.svg';
import { ReactComponent as LogoutIcon } from './icons-svg/logout.svg';
import { ReactComponent as AttendanceIcon } from './icons-svg/attendance.svg';
import PermissionRequest from './PermissionRequest';
import AdmissionApplications from './AdmissionApplications';
import Attendance from './Attendance';
import { getAuth, signOut } from 'firebase/auth';
import { firestore } from './firebaseConfig';
import { updateDoc, collection, getDocs } from "firebase/firestore";
import pincode from "pincode-distance";


const LaundrySchedule = () => <div>Laundry Schedule Page</div>;
const HostelFees = () => <div>Hostel Fees Page</div>;
const PeriodicShuffling = () => <div>Periodic Shuffling Page</div>;

const Dashboard = () => {
  const [activeLink, setActiveLink] = useState(0);
  const history = useHistory();

  useEffect(() => {
    // Set active link state to the index of the Rooms option
    console.log('Setting active link to Rooms');
    setActiveLink(options.findIndex(option => option.path === '/components/Rooms'));
  }, []);

  const handleLinkClick = (index) => {
    setActiveLink(index);
    console.log(`Link clicked: ${index}`);
  };

  const options = [
    { name: 'Rooms', path: '/components/Rooms', icon: <RoomsIcon className="icons-dash" /> },
    { name: 'Permission Request', path: '/components/PermissionRequest', icon: <PermissionIcon className="permi-icons-dash" /> },
    { name: 'Laundry Schedule', path: '/laundry-schedule', icon: <LaundryIcon className="icons-dash" /> },
    { name: 'Notice Board', path: '/components/NoticeBoard', icon: <NoticeIcon className="icons-dash" /> },
    { name: 'Attendance', path: '/components/Attendance', icon: <AttendanceIcon className="icons-dash" /> },
    { name: 'Hostel Fees', path: '/hostel-fees', icon: <FeeIcon className="icons-dash" /> },
    { name: 'Periodic Shuffling', path: '/periodic-shuffling', icon: <PShuffleIcon className="icons-dash" /> },
    { name: 'Admission Applications', path: '/AdmissionApplications', icon: <ApplicationIcon className="icons-dash" /> },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-nav">
        {options.map((option, index) => (
          <Link key={index} to={option.path} className={`dashboard-option ${index === activeLink ? 'active' : ''}`}
            onClick={() => handleLinkClick(index)}>
            <div className="icon-text-container">
              {option.icon}
              <span>{option.name}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="dashboard-content">
        <Switch>
          <Route path="/components/Rooms" component={Rooms} />
          <Route path="/student-info/:roomNumber" component={StudentDetails} />
          <Route path="/components/PermissionRequest" component={PermissionRequest} />
          <Route path="/laundry-schedule" component={LaundrySchedule} />
          <Route path="/components/NoticeBoard" component={NoticeBoard} />
          <Route path="/components/Attendance" component={Attendance} />
          <Route path="/hostel-fees" component={HostelFees} />
          <Route path="/periodic-shuffling" component={PeriodicShuffling} />
          <Route path="/AdmissionApplications" component={AdmissionApplications} />
        </Switch>
      </div>
    </div>
  );
};

const Services = () => {
  const history = useHistory();

  useEffect(() => {
    // Calculate distance and update Firestore when component mounts
    calculateDistanceAndUpdateFirestore();
    // const distance = Pincode.getDistance("625147", "689121");
    // console.log(distance)
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      history.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const Pincode = new pincode();


  const calculateDistanceAndUpdateFirestore = async () => {
    const studentsCollection = collection(firestore, 'Users'); 
    const querySnapshot = await getDocs(studentsCollection);
    querySnapshot.forEach(async (doc) => {
      const studentData = doc.data();
      // console.log(studentData.Pincode);
      const distance = await calculateDistance(studentData.Pincode); // Calculate distance using pincode-distance package
      // Update Firestore document with distance field
      await updateDoc(doc.ref, { distance : distance });
    });
  };

  const calculateDistance = async (studentPincode) => {
    // Calculate distance using 'pincode-distance' package
    // console.log(studentPincode);
    const distance = Pincode.getDistance(studentPincode, "689121");
    console.log(distance);
    // Replace the above lines with actual usage of 'pincode-distance' package
    return distance; // Dummy distance for testing
  };

  return (
    <Router>
      <div className="App">
        <Icon className='icon-logo' />
        <div className='logo'>hms</div>
        <div className="header">
          <h1>Hostel Management Portal</h1>
          <button className='logout' onClick={handleLogout}><LogoutIcon className='icolog' />Log Out</button>
        </div>
        <Dashboard />
      </div>
    </Router>
  );
};

export default Services;
