import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

const FeePayment = () => {
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const usersCollection = collection(firestore, 'Users');
        const querySnapshot = await getDocs(usersCollection);
        const fetchedStudents = querySnapshot.docs
          .filter(doc => doc.data().isAllocated)
          .map(doc => ({
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

  const calculateFee = (monthlyFee, consecutive5DaysAbsent) => {
    let fee = monthlyFee;
    // Calculate reduction based on consecutive days absent
    fee -= (monthlyFee * (consecutive5DaysAbsent * 0.16)); // 16% reduction for each consecutive day
    return fee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform fee calculation for each student
    const feePayments = students.map(student => ({
      id: student.id,
      name: student.Name,
      fee: calculateFee(monthlyFee, student.consecutive5DaysAbsent)
    }));
    // Display fee payments
    console.log('Fee Payments:', feePayments);
    
    // Store fee payments in MonthlyFee collection
    try {
      const monthlyFeeCollection = collection(firestore, 'MonthlyFee');
      await Promise.all(feePayments.map(async (payment) => {
        await addDoc(monthlyFeeCollection, {
          studentId: payment.id,
          studentName: payment.name, // Corrected here
          fee: payment.fee,
          month: selectedMonth
        });
      }));
      console.log('Fee payments stored in MonthlyFee collection.');
    } catch (error) {
      console.error('Error storing fee payments:', error);
    }
  };

  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Fee Payment</h2>
      <form style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="monthlyFee" style={{ marginRight: '10px' }}>Monthly Fee:</label>
          <input
            type="number"
            id="monthlyFee"
            value={monthlyFee}
            onChange={(e) => setMonthlyFee(Number(e.target.value))}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="selectedMonth" style={{ marginRight: '10px' }}>Month:</label>
          <input
            type="text"
            id="selectedMonth"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            required
          />
        </div>
        <button type="button" onClick={handleSubmit} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>SUBMIT</button>
      </form>
      <div>
        <h3 style={{ marginBottom: '10px' }}>Students Fee Payments</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {students.map(student => (
            <li key={student.id} style={{ marginBottom: '5px' }}>
              <strong>{student.Name}</strong>: {calculateFee(monthlyFee, student.consecutive5DaysAbsent)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeePayment;
