import React, { useState, useEffect } from 'react';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { app, db } from '../firebase'; // Assuming db is your Firebase Realtime Database instance
import { ref, get } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './login.css'

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const auth = getAuth(app);
        const superadminRef = ref(db, 'admin/1'); // Accessing the Realtime Database correctly
        const snapshot = await get(superadminRef);

        if (snapshot.exists()) {
          const superadminData = snapshot.val();
          if (superadminData.email === email && superadminData.password === password) {
            if (auth.currentUser && auth.currentUser.emailVerified) {
              toast.success('Email is verified!');
            } else {
              setError('Please verify your email before logging in.');
            }
          }
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    checkVerification();
  }, [email, password]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      if (!auth.currentUser.emailVerified) {
        await sendVerificationEmail(auth.currentUser);
        toast.info('Verification email sent. Please check your inbox and click on the verification link.');
      } else {
        navigate('/dashboard');
      }
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Error signing in. Please try again later.');
      setLoading(false);
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      console.log('Verification email sent.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Error sending verification email. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={loading}>Login</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminLogin;
