import React from 'react';
import { useState } from 'react';
import '../assets/style/Home.css';
import GlobalMap from './GlobalMap';
import USMap from './USMap';

function Home() {
  

  return (
    <div className='global-map'>
      <GlobalMap/>
      {/* <USMap/> */}
    </div>
  );
}

export default Home;