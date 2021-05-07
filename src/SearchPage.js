import React from 'react';
import './SearchPage.css'
import { Button } from "@material-ui/core";
import SearchResult from './SearchResult'

function SearchPage() {
  return (
    <div className='searchPage'>
        <div className='searchPage__info'>
            <p>
                62 stays. 26 august to 30 august . 2 guest
            </p>
            <h1>Stays nearby</h1>
            <Button variant="outlined">Cancellation Flexibility</Button>
            <Button variant="outlined">Type of Place</Button>
            <Button variant="outlined">Price</Button>
            <Button variant="outlined">Rooms</Button>
            <Button variant="outlined">More filters</Button>

        </div>
         <SearchResult 
            img="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU"
            location="Private room in center of London"
            title="Stay at this spacious Edwardian House"
            description="1 guest . 1 bedroom. 1 bed. 1.5 shared bathrooms. Wifi. Kitchen. Free parking. Washing Machine"
            star={4.73}
            price="$30/night"
            total="$117 total"     
         
         />
          <SearchResult 
            img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRexgJ7aWHPTBZZg9vgAUe6esJQIzqNTZr9hw&usqp=CAU"
            location="Stratford London"
            title="Stay at this spacious Edwardian House"
            description="1 guest . 1 bedroom. 1 bed. 1.5 shared bathrooms. Wifi. Kitchen. Free parking. Washing Machine"
            star={4.52}
            price="$50/night"
            total="$567 total"     
         
         />

       <SearchResult 
            img="data:image/jpeg;base64,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"
            location="Room in center of Manchester"
            title="Modern Luxurious Apartment"
            description="1 guest . 1 bedroom. 1 bed. 1.5 shared bathrooms. Wifi. Kitchen. Free parking. Washing Machine"
            star={4.87}
            price="$60/night"
            total="$707 total"     
         
         />    
    </div>
  );
}

export default SearchPage;
