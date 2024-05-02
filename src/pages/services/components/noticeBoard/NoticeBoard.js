import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firestore } from '../../../../firebaseConfig'; // Import your Firestore configuration
import './noticeboard.css'; // Import your CSS file for styling

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchedNotices, setSearchedNotices] = useState([]);

  // Check if 'notices' collection exists, if not create it
  useEffect(() => {
    const checkNoticeCollection = async () => {
      try {
        const noticeCollectionRef = collection(firestore, 'notice');
        await getDocs(noticeCollectionRef);
      } catch (error) {
        console.error("Notice collection doesn't exist, creating...");
        // Create 'notice' collection
        await firestore.collection('notice').doc();
      }
    };

    checkNoticeCollection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noticeData = {
      title,
      content,
      date: new Date().toLocaleString(), // Use local date and time format
    };

    try {
      const docRef = await addDoc(collection(firestore, 'notice'), noticeData);
      console.log('Notice written with ID: ', docRef.id);
      setNotices([...notices, noticeData]);
    } catch (error) {
      console.error('Error adding notice: ', error);
    }

    setTitle('');
    setContent('');
  };

  const handleSearch = async () => {
    if (!searchDate) {
      setSearchedNotices([]);
      return;
    }

    // Format the search date to match the input date format (yyyy-MM-dd)
    const formattedSearchDate = new Date(searchDate).toISOString().split('T')[0];
    console.log('Formatted search date:', formattedSearchDate);

    try {
      const querySnapshot = await getDocs(collection(firestore, 'notice'));
      const filteredNotices = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(notice => {
          // Extract the date part of the notice date in the same format as the search date
          const formattedNoticeDate = new Date(notice.date).toISOString().split('T')[0];
          console.log('Formatted notice date:', formattedNoticeDate);
          // Check if the notice date includes the search date
          return formattedNoticeDate === formattedSearchDate;
        });
      console.log('Filtered notices:', filteredNotices);
      setSearchedNotices(filteredNotices);
    } catch (error) {
      console.error('Error searching notices: ', error);
    }
  };

  return (
    <div className="notice-board-container">
      <h2 className="notice-board-title">Notice Board</h2>
      <form className="notice-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="notice-title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="notice-content-input"
          placeholder="Type your notice here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">
          Send
        </button>
      </form>
      <div className="search-container">
        <input
          type="date"
          className="date-input"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="previous-notices">
        {(searchDate ? searchedNotices : notices).map((notice, index) => (
          <div key={index} className="notice-block">
            <strong className="notice-title">{notice.title}</strong>
            <p className="notice-content">{notice.content}</p>
            <span className="notice-date">{notice.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
