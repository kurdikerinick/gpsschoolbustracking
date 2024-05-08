import React, { useState, useEffect } from 'react';
import './addstudents.css'; // Import CSS file for styling
import { db, ref, get } from '../firebase.js'; // Import the necessary Firebase database functions
import { push } from 'firebase/database';
import { toast } from 'react-toastify';
import ToastMessage from './toastmessage.js'; // Import the ToastMessage component
import AdminDashboard from './dashboard.js';

const AddStudent = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [studentName, setStudentName] = useState('');
    const [grade, setGrade] = useState('');
    const [selectedBus, setSelectedBus] = useState('');
    const [buses, setBuses] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for showing success message

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get a reference to the 'students' node in the database
        const studentsRef = ref(db, 'students');

        // Push form data to Firebase Realtime Database
        push(studentsRef, {
            studentNumber,
            studentName,
            grade,
            busNumber: selectedBus
        })
            .then(() => {
                console.log('Student data saved successfully');
                toast.success('Student added successfully!');
                setShowSuccessMessage(true);
                // Reset form fields
                setStudentNumber('');
                setStudentName('');
                setGrade('');
                setSelectedBus('');
                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            })
            .catch((error) => {
                console.error('Error saving student data: ', error);
                toast.error('Error adding student. Please try again later.');
            });
    };

    return (
        <div className='container'>
            <AdminDashboard />
            <div className="add-student-container">
                <h2>Add Student for School Bus</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="studentNumber">Student Number:</label>
                        <input
                            type="text"
                            id="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            placeholder="Enter student number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentName">Student Name:</label>
                        <input
                            type="text"
                            id="studentName"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Enter student name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="grade">Grade:</label>
                        <input
                            type="text"
                            id="grade"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="Enter grade"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="busNumber">Bus Number & Route:</label>
                        <select
                            id="busNumber"
                            value={selectedBus}
                            onChange={(e) => setSelectedBus(e.target.value)}
                            required
                        >
                            <option value="">Select Bus Number & Route</option>
                            {buses.map(bus => (
                                <option key={bus.id} value={bus.id}>{bus.busNumber} - {bus.route}</option>
                            ))}
                        </select>
                    </div>
                    <button className='addbuttons' type="submit">Add Student</button>
                </form>
                {/* Conditional rendering of toast message */}
                {showSuccessMessage && <ToastMessage message="Student added successfully!" />}
            </div>
        </div>
    );
};

export default AddStudent;
