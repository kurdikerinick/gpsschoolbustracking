import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/login';
import React from 'react';
import AdminDashboard from './components/dashboard';
import AddBus from './components/addbus';
import AddStudent from './components/addstudents';
import OpenGoogleMaps from './components/addroutes';
import OpenLayersMap from './components/openlayer';
import BusAssignment from './components/updatebusroutes';

function App() {
  return (
    <Router>
<Routes>
        <Route  path="/" element={<AdminLogin />}/>
        <Route  path="/dashboard" element={<AdminDashboard />}/>
        <Route path='/openlayers' element={<OpenLayersMap/>}/>
        <Route path="/addbus"  element={<AddBus />} />
        <Route path='/addstudents' element={<AddStudent />} />
        <Route path='/maps' element={<OpenGoogleMaps/>}/>
        <Route path='/assignbus' element={<BusAssignment/>}/>
</Routes>
      
    </Router>

  );
}

export default App;
