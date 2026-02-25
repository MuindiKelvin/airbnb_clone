import React, { useState } from 'react';
import './Search.css';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { Button } from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People';
import SearchIcon from '@material-ui/icons/Search';
import { useHistory } from "react-router-dom";

function Search() {
  const history = useHistory();
  const [location,  setLocation]  = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate,   setEndDate]   = useState(new Date());
  const [guests,    setGuests]    = useState(2);

  const selectionRange = {
    startDate,
    endDate,
    key: 'selection',
  };

  function handleSelect(ranges) {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  }

  function handleSearch() {
    if (!location.trim()) {
      alert('Please enter a destination.');
      return;
    }

    const params = new URLSearchParams({
      location: location.trim(),
      checkIn:  startDate.toISOString(),
      checkOut: endDate.toISOString(),
      guests,
    });

    history.push(`/search?${params.toString()}`);
  }

  return (
    <div className='search'>
      <div className='search__location'>
        <SearchIcon style={{ color: '#ff385c', marginRight: 8 }} />
        <input
          className='search__locationInput'
          type='text'
          placeholder='Where are you going?'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <DateRangePicker
        ranges={[selectionRange]}
        onChange={handleSelect}
        minDate={new Date()}
        rangeColors={['#ff385c']}
      />

      <div className='search__guests'>
        <h2>Number of guests <PeopleIcon /></h2>
        <input
          min={1}
          value={guests}
          type='number'
          onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
        />
      </div>

      <Button
        className='search__button'
        onClick={handleSearch}
        variant='contained'
      >
        Search Airbnb
      </Button>
    </div>
  );
}

export default Search;