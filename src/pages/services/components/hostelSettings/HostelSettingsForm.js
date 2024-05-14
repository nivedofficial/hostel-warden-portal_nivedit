// HostelSettingsForm.js
import React,{useState} from 'react';
import '../../../signup/signup.css';
import './HostelSettingsForm.css';
import { firestore } from '../../../../firebaseConfig';
import { updateDoc, collection, getDocs } from "firebase/firestore";
import { RoomCreation } from '../rooms/components/roomCreation';

const HostelSettingsForm = () => {
  const [capacity, setCapacity] = useState('');
  const [noOfRooms, setNoOfRooms] = useState('');
  const [noOfFloors, setNoOfFloors] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const wardenCollection = collection(firestore, 'Warden'); 
      const querySnapshot = await getDocs(wardenCollection);
      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { 
          CapacityOfEachRoom: parseInt(capacity),
          NoOfRoomsInEachFloor: parseInt(noOfRooms),
          NoOfFloors: parseInt(noOfFloors),
        });
      });
      console.log('Hostel settings updated successfully.');
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error updating hostel settings:", error);
    }
  };
  

  return (
    <div className='upbody'>
    <div className="sign-up-form">
      <h1 className="sign-up-form__title">Hostel Configuration</h1>
      <form onSubmit={handleSubmit}>
        <div className="sign-up-form__group">
          <label htmlFor="noOfFloors">No Of Floors</label>
          <input type="number" id="noOfFloors" value={noOfFloors} onChange={(e) => setNoOfFloors(e.target.value)} />
        </div>
        <div className="sign-up-form__group">
          <label htmlFor="noOfRooms">No Of Rooms In Each Floor</label>
          <input type="number" id="noOfRooms" value={noOfRooms} onChange={(e) => setNoOfRooms(e.target.value)} />
        </div>
        <div className="sign-up-form__group">
          <label htmlFor="capacity">Capacity Of Each Room</label>
          <input type="number" id="capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </div>

       
        <button type="submit" className="sign-up-form__button">Submit</button>
      </form>
      {formSubmitted && <RoomCreation />}
    </div>
    </div>

  );
};

export default HostelSettingsForm;
