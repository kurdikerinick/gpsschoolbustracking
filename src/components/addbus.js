import React, { useState, useEffect } from 'react';
import './addbus.css';
import AdminDashboard from './dashboard';
import { db, push, ref, get } from '../firebase.js';
import { toast } from 'react-toastify';
import ToastMessage from './toastmessage.js';

const AddBus = () => {
    const [busNumber, setBusNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [routes, setRoutes] = useState([]); 
    const [selectedRoute, setSelectedRoute] = useState(''); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const routesRef = ref(db, 'routes');
        const fetchRoutes = async () => {
            try {
                const snapshot = await get(routesRef); 
                if (snapshot.exists()) {
                    const routesData = snapshot.val();
                    const routesArray = Object.keys(routesData).map((key) => ({
                        id: key,
                        ...routesData[key],
                    }));
                    setRoutes(routesArray);
                }
            } catch (error) {
                console.error('Error fetching routes: ', error);
                toast.error('Error fetching routes. Please try again later.');
            }
        };
        fetchRoutes();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get the selected route object
        const selectedRouteObj = routes.find(route => route.id === selectedRoute);
        // Extract the routeName from the selected route object
        const selectedRouteName = selectedRouteObj ? selectedRouteObj.routeName : '';

        // Get a reference to the 'buses' node in the database
        const busesRef = ref(db, 'buses');
        // Push form data along with selected routeName to Firebase Realtime Database
        push(busesRef, {
            busNumber,
            capacity,
            route: selectedRouteName,
        })
            .then(() => {
                console.log('Bus data saved successfully');
                toast.success('Bus registered successfully!');
                setShowSuccessMessage(true);
                // Reset form fields
                setBusNumber('');
                setCapacity('');
                setSelectedRoute('');
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            })
            .catch((error) => {
                console.error('Error saving bus data: ', error);
                toast.error('Error saving bus data. Please try again later.');
            });
    };

    return (
        <div className="add-bus-container">
            <AdminDashboard />
            <div className="register-bus-container">
                <h2>Register School Bus</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="busNumber">Bus Number:</label>
                        <input
                            type="text"
                            id="busNumber"
                            value={busNumber}
                            onChange={(e) => setBusNumber(e.target.value)}
                            placeholder="Enter bus number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="capacity">Capacity:</label>
                        <input
                            type="number"
                            id="capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="Enter capacity"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="route" className="select-label">Select Route:</label>
                        <select
                            id="route"
                            value={selectedRoute}
                            onChange={(e) => setSelectedRoute(e.target.value)}
                            className="select-dropdown" // Apply CSS class for the select dropdown
                            required
                        >
                            <option value="">Select route</option>
                            {routes.map((route) => (
                                <option key={route.id} value={route.id} className="option-item"> {/* Apply CSS class for the options */}
                                    {route.routeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className='addbuttons' type="submit">Register Bus</button>
                </form>
            </div>
            {/* Conditional rendering of toast message */}
            {showSuccessMessage && <ToastMessage message="Bus registered successfully!" />}
        </div>
    );
};

export default AddBus;
