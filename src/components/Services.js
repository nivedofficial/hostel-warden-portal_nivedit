// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './Services.css';
import Rooms from './Rooms';
import StudentDetails from './StudentDetails';
import NoticeBoard from './NoticeBoard'
import { ReactComponent as Icon } from './icons-svg/icon.svg';
import { ReactComponent as RoomsIcon } from './icons-svg/rooms.svg'; 
import { ReactComponent as ApplicationIcon } from './icons-svg/application.svg';
import { ReactComponent as FeeIcon } from './icons-svg/fee.svg';
import { ReactComponent as PShuffleIcon } from './icons-svg/p-shuffle.svg';
import { ReactComponent as NoticeIcon } from './icons-svg/notice.svg';
import { ReactComponent as LaundryIcon } from './icons-svg/laundry.svg';
import { ReactComponent as PermissionIcon } from './icons-svg/permission.svg';
import { useState } from 'react';
import PermissionRequest from './PermissionRequest';
import AdmissionApplications from './AdmissionApplications';
import Attendance from './Attendance';


// Components for each option
const LaundrySchedule = () => <div>Laundry Schedule Page</div>;
// const NoticeBoard = () => <div>Notice Board Page</div>;
// const Attendance = () => <div>Attendance Page</div>;
const HostelFees = () => <div>Hostel Fees Page</div>;
const PeriodicShuffling = () => <div>Periodic Shuffling Page</div>;
// const AdmissionApplications = () => <div>Admission Applications Page</div>;

// Dashboard component
const Dashboard = () => {
  // Define activeLink and handleLinkClick here
  const [activeLink, setActiveLink] = useState(0);

  const handleLinkClick = (index) => {
    setActiveLink(index);
    // Your logic for handling link click
    console.log(`Link clicked: ${index}`);
  };

  const options = [
    { name: 'Rooms', path: '/components/Rooms', icon: <RoomsIcon className="icons-dash" /> }, 
    { name: 'Permission Request', path: '/components/PermissionRequest', icon: <PermissionIcon className="permi-icons-dash" /> },
    { name: 'Laundry Schedule', path: '/laundry-schedule', icon: <LaundryIcon className="icons-dash" /> },
    { name: 'Notice Board', path: '/components/NoticeBoard', icon: <NoticeIcon className="icons-dash" /> },
    { name: 'Attendance', path: '/componenets/Attendance' },
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
              {option.icon} {/* Include the icon here */}
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
// App component
const Services = () => {
  return (
    <Router>
      <div className="App">
        <Icon className='icon-logo' />
        <div className='logo'>hms</div>
        <div className="header">
          <h1>Hostel Management Portal</h1>
        </div>
        <Dashboard />
      </div>
    </Router>
  );
};

export default Services;
