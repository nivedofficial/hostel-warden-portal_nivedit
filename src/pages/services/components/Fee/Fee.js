import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc,updateDoc, addDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig';

const FeePayment = () => {
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [students, setStudents] = useState([]);
  const [paymentsExist, setPaymentsExist] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const roomsCollection = collection(firestore, 'Rooms');
        const querySnapshot = await getDocs(roomsCollection);
        let fetchedStudents = [];
        if (querySnapshot.empty) {
          console.log('Rooms collection is empty or does not exist.');
        } else {
          querySnapshot.forEach((doc) => {
            const room = doc.data();
            if (room.occupants && room.occupants.length > 0) {
              fetchedStudents = [
                ...fetchedStudents,
                ...room.occupants.map((student) => ({
                  id: student.id,
                  ...student
                }))
              ];
            }
          });
          setStudents(fetchedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  }, []);
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const monthlyFeeCollectionRef = collection(firestore, 'MonthlyFee');
        const querySnapshot = await getDocs(monthlyFeeCollectionRef);
        let monthlyDataArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          monthlyDataArray.push({ monthYear: doc.id, payments: data.payments });
        });
        setMonthlyData(monthlyDataArray);
      } catch (error) {
        console.error('Error fetching monthly data:', error);
      }
    };

    fetchMonthlyData();
  }, []);

  const calculateFee = (monthlyFee, consecutive5DaysAbsent) => {
    let fee = monthlyFee;
    fee -= monthlyFee * (consecutive5DaysAbsent * 0.16);
    return fee;
  };

  const handleSubmit = async () => {
    try {
      const monthYear = `${selectedMonth}-${selectedYear}`;
      const monthlyFeeCollectionRef = collection(firestore, 'MonthlyFee');
      const monthYearCollectionRef = doc(monthlyFeeCollectionRef, monthYear);
  
      const docSnapshot = await getDoc(monthYearCollectionRef);
  
      if (!docSnapshot.exists()) {
        const feePayments = students.map(student => ({
          studentId: student.id,
          studentName: student.Name,
          fee: calculateFee(monthlyFee, student.consecutive5DaysAbsent),
          isPaid: false
        }));
  
        await setDoc(monthYearCollectionRef, { payments: feePayments });
  
        console.log('Fee payments stored in MonthlyFee collection for', monthYear);
        setPaymentsExist(false);
      } else {
        setPaymentsExist(true);
        console.log('Fee payments already exist for', monthYear);
      }
  
      // Update consecutive days absent to zero for students with non-empty roomId
      const updatecon5 = async () => {
        try {
          const roomsCollection = collection(firestore, 'Rooms');
          const querySnapshot = await getDocs(roomsCollection);
          let fetchedStudents = [];
          if (querySnapshot.empty) {
            console.log('Rooms collection is empty or does not exist.');
          } else {
            console.log("inside")
            querySnapshot.forEach(async (doc) => {
              const room = doc.data();
              if (room.occupants && room.occupants.length > 0) {
                const updatedOccupants = room.occupants.map((student) => ({
                  ...student,
                  consecutive5DaysAbsent: 0,
                  consecutiveDaysAbsent: 0
                }));
      
                // Update the document in Firestore with the updated occupants
                const roomRef = doc.ref;
                await updateDoc(roomRef, { occupants: updatedOccupants });
      
                fetchedStudents = [
                  ...fetchedStudents,
                  ...updatedOccupants.map((student) => ({
                    id: student.id,
                    ...student
                  }))
                ];
              }
            });
            setStudents(fetchedStudents);
          }
        } catch (error) {
          console.error('Error fetching students:', error);
        }
      };
      
      updatecon5();
      
  
    } catch (error) {
      console.error('Error storing fee payments:', error);
    }
  };
  
  
  return (
    <div>
      <h2>Fee Payment</h2>
      <form>
        <label htmlFor="monthlyFee">Monthly Fee:</label>
        <input
          type="number"
          id="monthlyFee"
          value={monthlyFee}
          onChange={(e) => setMonthlyFee(Number(e.target.value))}
          required
        />
        <label htmlFor="selectedMonth">Month:</label>
        <input
          type="text"
          id="selectedMonth"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          required
        />
        <label htmlFor="selectedYear">Year:</label>
        <input
          type="number"
          id="selectedYear"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          required
        />
        <button type="button" onClick={handleSubmit}>SUBMIT</button>
      </form>
      {paymentsExist && <p style={{ color: 'red' }}>Fee payments already exist for {`${selectedMonth}-${selectedYear}`}</p>}
      <div>
        <h3>Students Fee Payments</h3>
        <ul>
          {students.map(student => (
            <li key={student.id}>
              <strong>{student.Name}</strong>: {calculateFee(monthlyFee, student.consecutive5DaysAbsent)}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {monthlyData.map(item => (
          <div key={item.monthYear} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', width: '350px' }}>
            <h3>{item.monthYear}</h3>
            <ul>
              {item.payments.map(payment => (
                <li key={payment.studentId}>
                  {payment.studentName}: Fee - <span style={{ color: 'blue' }}>{payment.fee}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeePayment;
