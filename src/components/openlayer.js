import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Overlay from 'ol/Overlay';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import OSM from 'ol/source/OSM';
import { useGeographic } from 'ol/proj';
import Zoom from 'ol/control/Zoom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, push, ref, update } from '../firebase.js';
import { onValue } from 'firebase/database';
import './openlayer.css';
import { Link } from 'react-router-dom';

const OpenLayersMap = () => {
    const [routeNames, setRouteNames] = useState([]);
    const [map, setMap] = useState(null);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [address, setAddress] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [newRouteName, setNewRouteName] = useState('');
    const [points, setPoints] = useState([]);
    const popupContentRef = useRef(null);
    const overlayRef = useRef(null);
    const [routes, setRoutes] = useState([]);

    useGeographic();

    useEffect(() => {
        // Fetch route names from Firebase
        const fetchRouteNames = () => {
            const routesRef = ref(db, 'routes');

            onValue(routesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const names = Object.values(data).map(route => route.routeName);
                    setRouteNames(names);
                } else {
                    setRouteNames([]);
                }
            });
        };

        fetchRouteNames();
    }, []);

    // Function to display location based on latitude and longitude
    const displayLocation = (latitude, longitude) => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`)
            .then(response => response.json())
            .then(data => {
                if (data && data.results && data.results.length > 0) {
                    setAddress(data.results[0].formatted_address);
                } else {
                    setAddress('Address not found');
                }
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                setAddress('Error fetching address');
            });
    };

    useEffect(() => {
        // Get user's current location
        const successCallback = position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLatitude(latitude);
            setLongitude(longitude);
            displayLocation(latitude, longitude);
        };

        const errorCallback = error => {
            let errorMessage = 'Unknown error';
            switch (error.code) {
                case 1:
                    errorMessage = 'Permission denied';
                    break;
                case 2:
                    errorMessage = 'Position unavailable';
                    break;
                case 3:
                    errorMessage = 'Timeout';
                    break;
                default:
                    errorMessage = 'Unexpected error';
                    break;
            }
            console.error(errorMessage);
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    }, []);

    useEffect(() => {
        // Initialize map instance
        if (map) {
            map.getView().setCenter([longitude, latitude]);
        }
    }, [latitude, longitude, map]);

    useEffect(() => {
        // Create new map instance
        const mapInstance = new Map({
            target: 'map-container',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features: points.map(point => {
                            const feature = new Feature({
                                geometry: new Point([point.longitude, point.latitude]),
                                name: point.pointName,
                            });
                            feature.setStyle(new Style({
                                image: new CircleStyle({
                                    radius: 6,
                                    fill: new Fill({ color: 'red' }),
                                    stroke: new Stroke({ color: 'white', width: 2 })
                                })
                            }));
                            return feature;
                        })
                    })
                })
            ],
            controls: [new Zoom()],
            view: new View({
                center: [longitude, latitude],
                zoom: 15
            })
        });

        // Create overlay for popup
        const overlay = new Overlay({
            element: document.getElementById('popup'),
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        mapInstance.addOverlay(overlay);
        overlayRef.current = overlay;

        setMap(mapInstance);

        return () => {
            mapInstance.setTarget(null);
        };
    }, [latitude, longitude, points]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setLatitude(parseFloat(lat));
                setLongitude(parseFloat(lon));
                setAddress(data[0].display_name);
            } else {
                setAddress('Location not found');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const addRouteToDatabase = (routeName) => {
        const routesRef = ref(db, 'routes');
        const newRoute = {
            routeName: routeName,
            points: [],
        };
        return push(routesRef, newRoute);
    };
    
    // Function to add a new point to a route in the Realtime Database
    const addPointToRouteInDatabase = (routeId, newPoint) => {
        const routeRef = ref(db, `routes/${routeId}/points`);
        return push(routeRef, newPoint);
    };
    
    // Function to handle adding a new route
    const handleAddRoute = () => {
        if (newRouteName.trim() === '') {
            toast.error('Please enter a valid route name');
            return;
        }
    
        addRouteToDatabase(newRouteName)
            .then((snapshot) => {
                const routeId = snapshot.key;
                setSelectedRoute(routeId); // Select the newly added route
                toast.success('Route added successfully!');
                setNewRouteName('');
            })
            .catch((error) => {
                console.error('Error adding route:', error);
                toast.error('Error adding route. Please try again later.');
            });
    };
    
    // Function to handle adding a new point to the selected route
    const handleAddPointToRoute = () => {
        if (selectedRoute.trim() === '') {
            toast.error('Please select a route');
            return;
        }
    
        const newPoint = {
            pointName: address,
            latitude: latitude,
            longitude: longitude,
            address: address,
        };
    
        addPointToRouteInDatabase(selectedRoute, newPoint)
            .then(() => {
                toast.success('Point added to route successfully');
            })
            .catch((error) => {
                console.error('Error adding point to route:', error);
                toast.error('Error adding point to route. Please try again later.');
            });
    };
    const handleMapClick = event => {
        if (map) {
            const clickedCoord = map.getEventCoordinate(event);
            if (clickedCoord) {
                const [clickedLongitude, clickedLatitude] = clickedCoord;
                setLongitude(clickedLongitude);
                setLatitude(clickedLatitude);
                getAddressFromCoordinates(clickedLatitude, clickedLongitude);
                map.getView().setCenter(clickedCoord);
            }
        }
    };

    const getAddressFromCoordinates = (latitude, longitude) => {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const addressParts = data.display_name.split(',').slice(0, 4);
                const address = addressParts.join(',');
                setAddress(address);
                console.log(address);
            })
            .catch(error => {
                console.error('Error fetching address:', error);
                setAddress('Error fetching address');
            });
    };

    return (
        <div>
          <div className="side-nav">
    <button className='addbuttons'><Link to="/dashboard">Dashboard</Link></button>

   

            {/* Search input */}
            <div className="nav-item">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Enter location"
              />
              <button  className='addbuttons' onClick={handleSearch}>Search</button>
            </div>
      
            {/* Route selection */}
            <div className="nav-item">
              <select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)}>
                <option value="">Select route</option>
                {routeNames.map((name, index) => (
                  <option key={index} value={name}>{name}</option>
                ))}
              </select>
            </div>
      
            {/* New route input */}
            <div className="nav-item">
              <input
                type="text"
                placeholder="Enter new route name"
                value={newRouteName}
                onChange={e => setNewRouteName(e.target.value)}
              />
              <button className='addbuttons' onClick={handleAddRoute}>Add Route</button>
            </div>
      
            {/* Latitude input */}
            <div className="nav-item">
                <label>Latitude</label>
               <input type="text" label='Latitude' value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>
      
            {/* Longitude input */}
            <div className="nav-item">
              Longitude: <input type="text" value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
      
            {/* Point name input */}
            <div className="nav-item">
              <input
                type="text"
                placeholder="Enter point name"
                value={address}
                onChange={e => getAddressFromCoordinates(e.target.value)}
              />
              <button className='addbuttons' onClick={handleAddPointToRoute}>Add Point to Route</button>
            </div>
          </div>
      
          {/* Map container */}
          <div id="map-container" className="map-container" onClick={handleMapClick}></div>
      
          {/* Popup overlay */}
          <div id="popup" className="ol-popup" style={{ textAlign: 'center' }}>
            <div ref={popupContentRef}>
              <p>Latitude: {latitude}</p>
              <p>Longitude: {longitude}</p>
              <p>Address: {address ? address : 'Loading...'}</p>
            </div>
          </div>
        </div>
      );
    }
export default OpenLayersMap;
