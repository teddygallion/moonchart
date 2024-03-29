import React, { useState, useEffect } from 'react';
import './App.css'

const App = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const monthsOfYear = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const [moonPhases, setMoonPhases] = useState({});

  useEffect(() => {
    generateCalendar();
    fetchMoonPhases();
  }, [currentMonth]);

  const fetchMoonPhases = async () => {
    try {
      const response = await fetch('./netlify/functions/proxy');  // Adjust the path based on your Netlify Function endpoint
      const data = await response.json();
      console.log(data);
      const phasesMapping = {};
      data.phasedata.forEach((phase) => {
        phasesMapping[phase.day] = {
          name: phase.phase,
          emoji: getMoonPhaseEmoji(phase.phase),
        };
      });

      setMoonPhases(phasesMapping);
    } catch (error) {
      console.error('Error fetching moon phases:', error);
    }
  };

  const getMoonPhaseEmoji = (phaseName) => {
    const phaseEmojiMap = {
      'New Moon': '🌑',
      'First Quarter': '🌓',
      'Full Moon': '🌕',
      'Last Quarter': '🌗',
    };

    return phaseEmojiMap[phaseName] || '🌘';
  };

  const generateCalendar = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();

    const calendarArray = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      calendarArray.push('');
    }

    // Add days of the month with moon phases
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const moonPhaseData = moonPhases[i];
      const moonPhaseEmoji = moonPhaseData ? moonPhaseData.emoji : '';
      calendarArray.push(
        <>
          {i} <span role="img">{moonPhaseEmoji}</span>
        </>
      );
    }

    // Split the array into rows (weeks)
    const calendarRows = [];
    while (calendarArray.length > 0) {
      calendarRows.push(calendarArray.splice(0, 7));
    }

    // Render the calendar
    const calendarTable = (
      <div>
        <h2>{monthsOfYear[currentMonth -1]} {currentYear}</h2>
        <table>
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarRows.map((week, rowIndex) => (
              <tr key={rowIndex}>
                {week.map((day, index) => (
                  <td key={index}>{day}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    setCalendarData(calendarTable);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 1) {
        setCurrentYear((prevYear) => currentYear - 1);
        return 12;
      } else {
        return prevMonth - 1;
      }
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 12) {
        setCurrentYear((prevYear) => currentYear +1);
        return 1;
      } else {
        return prevMonth + 1;
      }
    });
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div>
      <button onClick={goToPreviousMonth}> {'\<'} </button>
        <button onClick={goToNextMonth}> {'\>'} </button>
        {calendarData}
      </div>
    </div>
  );
};

export default App;
