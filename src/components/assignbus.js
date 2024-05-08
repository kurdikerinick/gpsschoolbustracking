// import React, { useState, useEffect } from 'react';
// import { db, ref, get } from '../firebase.js';

// const BusAssignment = () => {
//     const [routes, setRoutes] = useState([]);
//     const [selectedRoute, setSelectedRoute] = useState('');

//     useEffect(() => {
//         const routesRef = ref(db, 'routes');

//         const fetchRoutes = async () => {
//             try {
//                 const snapshot = await get(routesRef);
//                 if (snapshot.exists()) {
//                     const routesData = snapshot.val();
//                     const routesArray = Object.entries(routesData).map(([routeName, route]) => ({
//                         routeName,
//                         ...route,
//                     }));
//                     setRoutes(routesArray);
//                 }
//             } catch (error) {
//                 console.error('Error fetching routes: ', error);
//             }
//         };

//         fetchRoutes();
//     }, []);

//     const handleRouteChange = (event) => {
//         setSelectedRoute(event.target.value);
//     };

//     return (
//         <div>
//             {/* Dropdown to select route */}
//             <h2>Select Route</h2>
//             <select value={selectedRoute} onChange={handleRouteChange}>
//                 <option value="">Select Route</option>
//                 {routes.map(route => (
//                     <option key={route.routeName} value={route.routeName}>{route.routeName}</option>
//                 ))}
//             </select>

//             {/* Display selected route and its points */}
//             {selectedRoute && (
//                 <div>
//                     <h2>Selected Route: {selectedRoute}</h2>
//                     <ul>
//                         {routes.map(route => {
//                             if (route.routeName === selectedRoute && route.points) {
//                                 return Object.entries(route.points).map(([pointId, point]) => (
//                                     <li key={pointId}>
//                                         <strong>Point Name:</strong> {point.pointName}<br />
//                                         <strong>Address:</strong> {point.address}<br />
//                                         <strong>Latitude:</strong> {point.latitude}<br />
//                                         <strong>Longitude:</strong> {point.longitude}
//                                     </li>
//                                 ));
//                             }
//                             return null;
//                         })}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default BusAssignment;
