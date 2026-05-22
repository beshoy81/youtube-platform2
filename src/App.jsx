import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import Signup from './Signup/Signup';
import Login from './Login/Login';
import Forgotpassword from './Forgotpassword/Forgotpassword';
import Resetcode from './Resetcode/Resetcode';
import ResetPassword from './ResetPassword/ResetPassword';
import NavbarComponent from './Nav/Nav';
import HomePage from './Home/Home';
import VideoPlayer from './VideoPlayer/VideoPlayer';
import ChannelPage from './ChannelPage/ChannelPage';
import Notfound from './Notfound/Notfound';
import Shorts from './Shorts/Shorts';
import SearchPage from './SearchPage/SearchPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    jwtDecode(token);
    return children;
  } catch (error) {
    localStorage.removeItem("userToken");
    return <Navigate to="/login" />;
  }
}

export default function App() {
  return (
    <div>
      <NavbarComponent />

      <Routes>
        
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/HomePage" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />

        <Route path="/video/:id" element={
          <ProtectedRoute>
            <VideoPlayer />
          </ProtectedRoute>
        } />

        <Route path="/channel/:channelId" element={
          <ProtectedRoute>
            <ChannelPage />
          </ProtectedRoute>
        } />

        <Route path="/search/:query" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />

        <Route path="/Shorts" element={
          <ProtectedRoute>
            <Shorts />
          </ProtectedRoute>
        } />

        
        <Route path="/signup" element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="/Forgotpassword" element={<Forgotpassword />} />
        <Route path="/Resetcode" element={<Resetcode />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />

        <Route path="*" element={<Notfound />} />

      </Routes>
    </div>
  );
}