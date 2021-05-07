import React from 'react';
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';
import LanguageIcon from '@material-ui/icons/Language';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Avatar } from '@material-ui/core';
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="header">
     <Link to='/'>
        <img 
           className='header__icon'
            src="data:image/png;base64,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" 
            alt=""
        />
        </Link>

        <div className='header__center'>
            <input type="text" />
            <SearchIcon />
        </div>

        <div className='header__right'>
            <p>Become a host</p>
            <LanguageIcon />
            <ExpandMoreIcon />
            <Avatar />
        </div>
      
    </div>
  );
}

export default Header;
