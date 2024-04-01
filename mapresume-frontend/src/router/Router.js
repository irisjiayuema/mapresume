import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../component/Home.js';
import Match from '../component/Match.js';
import ChartCards from '../component/Charts.js';
import HeatMap from '../component/HeatMap.js';
import About from '../component/About.js';

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/match"  element={<Match />} />
        <Route path="/charts" element={<ChartCards/>}/>
        <Route path="/charts/heatmap" element={<HeatMap/>}/>
        <Route path="about" element={<About/>}/>
      </Routes>
    );
  };

export default AppRoutes;