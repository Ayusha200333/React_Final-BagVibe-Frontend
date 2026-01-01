import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyOrderPage from './MyOrderPage';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/cartSlice';
import type { RootState, AppDispatch } from '../redux/store';

interface User {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as User | null;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/3 lg:w-1/4 shadow rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {user?.name || 'User'}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {user?.email || 'email@example.com'}
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrderPage key={Date.now()} />  
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
