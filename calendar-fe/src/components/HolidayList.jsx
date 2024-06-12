// components/HolidayList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const HolidayList = ({ countryCode, month, year }) => {
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
        const monthHolidays = response.data.filter(holiday => dayjs(holiday.date).month() === month);
        setHolidays(monthHolidays);
      } catch (error) {
        console.error('Error fetching holidays', error);
      }
    };

    fetchHolidays();
  }, [countryCode, month, year]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Holidays</h2>
      <ul className="list-disc ml-5">
        {holidays.map((holiday) => (
          <li key={holiday.date}>
            {holiday.date}: {holiday.localName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidayList;
