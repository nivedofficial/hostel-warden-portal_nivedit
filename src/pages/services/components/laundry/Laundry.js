import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig'; // Import your Firestore configuration
import './Laundry.css';

const LaundryBooking = () => {
  const [bookingsByDate, setBookingsByDate] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(firestore, 'laundry');
        const bookingsSnapshot = await getDocs(bookingsCollection);
        const bookingsData = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const bookingsGroupedByDate = await groupBookingsByDate(bookingsData);
        setBookingsByDate(bookingsGroupedByDate);
      } catch (error) {
        console.error('Error fetching laundry bookings: ', error);
      }
    };

    fetchBookings();
  }, []);

  // Function to group bookings by date
  const groupBookingsByDate = async (bookingsData) => {
    const groupedBookings = {};
    for (const booking of bookingsData) {
      const date = new Date(booking.date.seconds * 1000).toLocaleDateString();
      if (groupedBookings[date]) {
        groupedBookings[date].push(await enhanceBookingWithUserName(booking));
      } else {
        groupedBookings[date] = [await enhanceBookingWithUserName(booking)];
      }
    }
    return groupedBookings;
  };

  // Function to enhance booking with user name, room number, and increment washing machine number
  const enhanceBookingWithUserName = async (booking) => {
    try {
      console.log("User ID:", booking.userId); // Log the user ID
      // Construct the document reference correctly
      const userDocRef = doc(firestore, 'Users', booking.userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("User Data:", userData); // Log the user data
        const userName = userData.Name || 'Unknown'; // Access the 'Name' field correctly
        console.log("User Name:", userName); // Log the user name
        const roomNo = userData.RoomId || 'Unknown'; // Access the 'RoomId' field for room number
        console.log("Room No:", roomNo); // Log the room number
        const updatedBooking = { ...booking, userName, roomNo, washingMachine: booking.washingMachine + 1 }; // Increment washing machine number
        console.log("Updated Booking:", updatedBooking); // Log the updated booking
        return updatedBooking;
      } else {
        return { ...booking, userName: 'Unknown', roomNo: 'Unknown' };
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
      return { ...booking, userName: 'Unknown', roomNo: 'Unknown' };
    }
  };

  return (
    <div className="booking-page">
      {Object.entries(bookingsByDate).map(([date, bookings]) => (
        <div className="date-container" key={date}>
          <h2 className="date-title">{date}</h2>
          {bookings.map(booking => (
            <div className="booking-box" key={booking.id}>
              <div className="booking-details">
                <div className="time-slot">Time Slot: {booking.timeSlot}</div>
                <div className="washing-machine">Washing Machine: {booking.washingMachine}</div>
                <div className="user-name">User: {booking.userName}</div>
                <div className="room-no">Room No: {booking.roomNo}</div> {/* Display room number */}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LaundryBooking;
