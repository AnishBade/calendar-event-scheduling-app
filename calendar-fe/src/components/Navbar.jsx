// components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const Navbar = ({ isAuthenticated, username, onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsLogoutModalOpen(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-gray-800 p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Calendar App</Link>
        <div>
          {isAuthenticated ? (
            <>
              <span className="text-white mr-4">Welcome, {username}!</span>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 mx-5 rounded">
                Sign Up
              </Link>
            </>


          )}
        </div>
      </div>
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
