import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../component/Home.js';
import Match from '../component/Match.js';
import ChartCards from '../component/Charts.js';
import HeatMap from '../component/HeatMap.js';


const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/match"  element={<Match />} />
        <Route path="/charts" element={<ChartCards/>}/>
        <Route path="/charts/heatmap" element={<HeatMap/>}/>
      </Routes>
    );
  };

export default AppRoutes;