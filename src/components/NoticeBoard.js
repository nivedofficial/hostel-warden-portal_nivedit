import React, { useState, useEffect } from 'react';
import './noticeboard.css'; // Import your CSS file for styling

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchedNotices, setSearchedNotices] = useState([]);

  useEffect(() => {
    const storedNotices = JSON.parse(localStorage.getItem('notices')) || [];
    setNotices(storedNotices);
  }, []);

  const storeNoticesToLocalStorage = (updatedNotices) => {
    localStorage.setItem('notices', JSON.stringify(updatedNotices));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const noticeData = {
      title,
      content,
      date: new Date().toLocaleString(), // Use local date and time format
    };
    const updatedNotices = [...notices, noticeData];
    setNotices(updatedNotices);
    storeNoticesToLocalStorage(updatedNotices);
    setTitle('');
    setContent('');
  };

  const handleSearch = () => {
    if (!searchDate) {
      setSearchedNotices([]);
      return;
    }

    // Format the search date to match the input date format (yyyy-MM-dd)
    const formattedSearchDate = new Date(searchDate).toISOString().split('T')[0];
    console.log('Formatted search date:', formattedSearchDate);

    const filteredNotices = notices.filter(notice => {
      // Extract the date part of the notice date in the same format as the search date
      const formattedNoticeDate = new Date(notice.date).toISOString().split('T')[0];
      console.log('Formatted notice date:', formattedNoticeDate);
      // Check if the notice date includes the search date
      return formattedNoticeDate === formattedSearchDate;
    });

    console.log('Filtered notices:', filteredNotices);

    setSearchedNotices(filteredNotices);
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
