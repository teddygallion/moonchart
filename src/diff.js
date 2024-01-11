import React, { useState, useEffect } from 'react';
import './App.css'
const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moonPhases, setMoonPhases] = useState({});

  useEffect(() => {
    setCurrentDate(new Date());
    fetchMoonPhases(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, []);

  const fetchMoonPhases = async (year, month) => {
    try {
      const response = await fetch(`https://aa.usno.navy.mil/api/moon/phases/month?month=${month}&year=${year}`);
      const data = await response.json();

      const phasesMapping = {};
      data.phasedata.forEach(phase => {
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
        ' Waxing Crescent': '🌒',
         'First Quarter': '🌓',
         'Waxing Gibbous': '🌔',
         'Full Moon': '🌕',
         'Waning Gibbous': '🌖',
         'Third Quarter': '🌗',
         'Waning Crescent': '🌘'
    };

    return phaseEmojiMap[phaseName] || '🌘';
  };

  const generateCalendar = () => {
    // Implement your calendar rendering logic here
    // You can use the moonPhases state to access the moon phase data
    // and display it in the calendar cells.
    // Modify this based on your existing calendar rendering code.

    // Example rendering logic:
    const calendarCells = [];
    for (let day = 1; day <= 31; day++) {
      const moonPhaseData = moonPhases[day];
      const moonPhaseEmoji = moonPhaseData ? moonPhaseData.emoji : '';

      calendarCells.push(
        <div key={day} className="calendar-cell">
          <div className="day-number">{day}</div>
          <div className="moon-phase">{moonPhaseEmoji}</div>
        </div>
      );
    }

    return (
      <div className="calendar">
        {calendarCells}
      </div>
    );
    const goToNextMonth = () => {
        const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonthDate);
        fetchMoonPhases(nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1);
      };
    
      const goToPreviousMonth = () => {
        const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(previousMonthDate);
        fetchMoonPhases(previousMonthDate.getFullYear(), previousMonthDate.getMonth() + 1);
      };
  };

  return (
    <div>
      <h1>Calendar</h1>
      {generateCalendar()}
    </div>
  );
};

export default App;