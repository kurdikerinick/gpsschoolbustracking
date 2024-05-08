import React, { useState } from 'react';
import './addroutes.css';
import AdminDashboard from './dashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OpenGoogleMaps = () => {
    const [routes, setRoutes] = useState([{ name: '', points: [{ latitude: '', longitude: '', addressName: '' }] }]);

    const handleAddRoute = () => {
        setRoutes([...routes, { name: '', points: [{ latitude: '', longitude: '', addressName: '' }] }]);
    };

    const handleRemoveRoute = (index) => {
        const updatedRoutes = [...routes];
        updatedRoutes.splice(index, 1);
        setRoutes(updatedRoutes);
    };

    const handleAddPoint = (routeIndex) => {
        const updatedRoutes = [...routes];
        updatedRoutes[routeIndex].points.push({ latitude: '', longitude: '', addressName: '' });
        setRoutes(updatedRoutes);
    };

    const handleRemovePoint = (routeIndex, pointIndex) => {
        const updatedRoutes = [...routes];
        updatedRoutes[routeIndex].points.splice(pointIndex, 1);
        setRoutes(updatedRoutes);
    };

    const handleChangeRouteName = (index, value) => {
        const updatedRoutes = [...routes];
        updatedRoutes[index].name = value;
        setRoutes(updatedRoutes);
    };

    const fetchAddressName = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`);
            const data = await response.json();
            const address = data.results[0]?.formatted_address;
            return address;
        } catch (error) {
            console.error('Error fetching address:', error);
            return null;
        }
    };
    
    const handleChangePoint = async (routeIndex, pointIndex, field, value) => {
        const updatedRoutes = [...routes];
        updatedRoutes[routeIndex].points[pointIndex][field] = value;
    
        if (field === 'latitude' || field === 'longitude') {
            const latitude = updatedRoutes[routeIndex].points[pointIndex].latitude;
            const longitude = updatedRoutes[routeIndex].points[pointIndex].longitude;
    
            // Fetch address name using latitude and longitude
            const address = await fetchAddressName(latitude, longitude);
            updatedRoutes[routeIndex].points[pointIndex].addressName = address || '';
        }
    
        setRoutes(updatedRoutes);
    };

    const handleOpenMaps = () => {
        // Construct the Google Maps URL
        const mapsURL = `https://www.google.com/maps`;

        // Open Google Maps in a new window
        window.open(mapsURL, '_blank');
    };

    const handleAddRouteClick = () => {
        toast.success('Route added successfully');
    };

    const handleRemoveRouteClick = () => {
        toast.success('Route removed successfully');
    };

    const handleAddPointClick = () => {
        toast.success('Point added successfully');
    };

    const handleRemovePointClick = () => {
        toast.success('Point removed successfully');
    };

    return (
        <div className='map-container'>
            <AdminDashboard />
            <div className='maps'>

                {routes.map((route, routeIndex) => (
                    <div key={routeIndex} className='route'>
                        <button onClick={handleOpenMaps}>Open Google Maps</button>

                        <div>
                            <label htmlFor={`routeName-${routeIndex}`}>Route Name:</label>
                            <input
                                type="text"
                                id={`routeName-${routeIndex}`}
                                value={route.name}
                                onChange={(e) => handleChangeRouteName(routeIndex, e.target.value)}
                                placeholder="Enter route name"
                            />
                            {routeIndex > 0 && <button className='remove-route' onClick={() => { handleRemoveRoute(routeIndex); handleRemoveRouteClick(); }}>Remove Route</button>}
                        </div>
                        <div className='route-points'>
                            {route.points.map((point, pointIndex) => (
                                <div key={pointIndex} className='point'>
                                    <label htmlFor={`latitude-${routeIndex}-${pointIndex}`}>Latitude:</label>
                                    <input
                                        type="text"
                                        id={`latitude-${routeIndex}-${pointIndex}`}
                                        value={point.latitude}
                                        onChange={(e) => handleChangePoint(routeIndex, pointIndex, 'latitude', e.target.value)}
                                        placeholder="Enter latitude"
                                    />
                                    <label htmlFor={`longitude-${routeIndex}-${pointIndex}`}>Longitude:</label>
                                    <input
                                        type="text"
                                        id={`longitude-${routeIndex}-${pointIndex}`}
                                        value={point.longitude}
                                        onChange={(e) => handleChangePoint(routeIndex, pointIndex, 'longitude', e.target.value)}
                                        placeholder="Enter longitude"
                                    />
                                    <label htmlFor={`addressName-${routeIndex}-${pointIndex}`}>Location Name:</label>
                                    <input
                                        type="text"
                                        id={`addressName-${routeIndex}-${pointIndex}`}
                                        value={point.addressName}
                                        onChange={(e) => handleChangePoint(routeIndex, pointIndex, 'addressName', e.target.value)}
                                        placeholder="Enter location name"
                                    />
                                    {pointIndex === route.points.length - 1 && (
                                        <span className='add-point' onClick={() => { handleAddPoint(routeIndex); handleAddPointClick(); }}>+</span>
                                    )}
                                    {pointIndex > 0 && <span className='remove-point' onClick={() => { handleRemovePoint(routeIndex, pointIndex); handleRemovePointClick(); }}>-</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button className='add-route' onClick={() => { handleAddRoute(); handleAddRouteClick(); }}>Add Route</button>
            </div>

        </div>
    );
};

export default OpenGoogleMaps;
