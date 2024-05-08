import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Dashboard as DashboardIcon, DirectionsBus, PersonAdd, Assignment, People, Settings, LocationOn } from '@mui/icons-material';
import './dashboard.css';

const AdminDashboard = () => {
  return (
    // <div></div>
      <div className="sidebar">
        
        <ul>
          <li>
            <IconButton component={Link} to="/dashboard" color="inherit">
              <DashboardIcon /> Dashboard
            </IconButton>
          </li>
          <li>
            <IconButton component={Link} to="/openlayers" color="inherit">
              <LocationOn /> Add Routes
            </IconButton>
          </li>
          <li>
            <IconButton component={Link} to="/addbus" color="inherit">
              <DirectionsBus />Add Bus
            </IconButton>
          </li>
          <li>
            <IconButton component={Link} to="/addstudents" color="inherit">
              <PersonAdd />Add Student
            </IconButton>
          </li>
          <li>
            <IconButton component={Link} to="/assignbus" color="inherit">
              <Assignment /> Assign bus
            </IconButton>
          </li>
          <li>
            <IconButton component={Link} to="/" color="inherit">
              <People />Users
            </IconButton>
          </li>
          <li>
            <IconButton component={Link} to="/settings" color="inherit">
              <Settings />Settings
            </IconButton>
          </li>
        </ul>
      </div>
      
  );
};

export default AdminDashboard;
