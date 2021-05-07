import React from 'react';
import './Home.css';
import Banner from './Banner'
import Card from './Card'

function Home() {
  return (
    <div className='home'>
    
        <Banner />

        <div className='home__section'>
          <Card 
            src="https://a0.muscache.com/im/pictures/2f13349d-879d-43c6-83e3-8e5679291d53.jpg?im_w=320"
            title="Online Experiences"
            Description="Unique activities we can do together, led by a world of hosts."
          />

          <Card
           src="https://a0.muscache.com/im/pictures/36f53e61-db8d-403c-9122-5b761c0e4264.jpg?im_w=320"
           title="Unique stays"
           description='Spaces that are more just a place to sleep.'

          />
          <Card 
          src="https://a0.muscache.com/im/pictures/7d82ca14-56e5-4465-8218-dcfa7d69b6ac.jpg?im_w=320"
          title="Entire homes"
          description="Comfortabe private places, with room for friends and family."
          />

          <Card 
          src="https://a0.muscache.com/im/pictures/10a638e1-6aff-4313-8033-1275cec83987.jpg?im_w=320"
          title="Pets Allowed"
          description="We value the love of dogs as pets."
          />
        </div>

        <div className='home__section'>
          <Card 
            src="https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg?im_w=320"
            title="3 Bedroom Flat in Bournemouth"
            description="Superhost with a Stunning view of the beachside in Sunny Bournemouth"
            price="$130/night"
          />
          <Card
           src="https://thespaces.com/wp-content/uploads/2017/08/Courtesy-of-Airbnb.jpg?im_w=320"
           title="Penthouse in London"
           description="Enjoy the amazing sights of London with this stunning penthouse"
           price="$350/night" 
          />
          <Card

              src="https://media.nomadicmatt.com/2018/apartment.jpg?im_w=320"
              title="1 Bedroom Apartment"
              description="Superhost with great aminities and a fabulous shopping complex nearby"
              price="$70/night" 
          
          />
        </div>
      
    </div>
  );
}

export default Home;
