import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './dashboard.js';
import './updatebusroutes.css';
import { ref, get, db, update } from '../firebase.js';

const BusAssignment = () => {
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routesRef = ref(db, 'routes');
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

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const busesRef = ref(db, 'buses');
                const snapshot = await get(busesRef);
                if (snapshot.exists()) {
                    const busesData = snapshot.val();
                    const busesArray = Object.keys(busesData).map(key => ({
                        id: key,
                        busNumber: busesData[key].busNumber,
                        route: busesData[key].route // Assuming 'route' is a property of each bus object
                    }));
                    setBuses(busesArray);
                }
            } catch (error) {
                console.error('Error fetching buses: ', error);
                toast.error('Error fetching buses. Please try again later.');
            }
        };

        fetchBuses();
    }, []);

    const handleUpdateBusRoute = async (busId, routeId) => {
        try {
            // Fetch the route name corresponding to the selected routeId
            const selectedRoute = routes.find(route => route.id === routeId);
            if (!selectedRoute) {
                toast.error('Selected route not found.');
                return;
            }

            // Update the route name for the selected bus in the database
            const busRef = ref(db, `buses/${busId}`);
            await update(busRef, { route: selectedRoute.routeName });
            toast.success('Route updated successfully');
        } catch (error) {
            console.error('Error updating route for bus: ', error);
            toast.error('Error updating route for bus. Please try again later.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateBusRoute(selectedBus, selectedRoute);
    };

    return (
        <div className='update-bus-routes'>
            <AdminDashboard />
            <div className='update-bus-container'>
                <form onSubmit={handleSubmit}>
                <h2>Buses</h2>
                    <div className='form-group'>
                        <select value={selectedBus} className="select-dropdown" onChange={(e) => setSelectedBus(e.target.value)}>
                            <option value="">Select bus</option>
                            {buses.map((bus) => (
                                <option key={bus.id} value={bus.id}>{bus.busNumber}</option>
                            ))}
                        </select>
                    </div>
                    <h2>Routes</h2>
                    <div className='form-group'>
                        <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
                            <option value="">Select route</option>
                            {routes.map((route) => (
                                <option key={route.id} value={route.id}>{route.routeName}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button className='addbuttons' type="submit">Update Route</button>
                </form>
            </div>
            <ToastContainer /> {/* Toast Container */}
        </div>
    );
};

export default BusAssignment;
