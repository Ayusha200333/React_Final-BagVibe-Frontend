import React, { useState } from 'react';
import { HiOutlineUser, HiOutlineShoppingBag } from 'react-icons/hi';
import { HiBars3BottomRight } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Cart from '../Layout/Cart';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const { cart } = useSelector((state: any) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const cartItemCount = cart?.products?.reduce((total: number, product: any) => total + product.quantity, 0) ?? 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(prev => !prev);
  };

  const toggleCart = () => {
    setDrawerOpen(prev => !prev);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="container mx-auto flex items-center justify-between py-6 px-6 lg:px-8">
        {/* Logo */}
        <div>
          <Link 
            to="/" 
            className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
          >
            BagVibe
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-10">
          <Link 
            to="/collections/all?gender=Men" 
            className="text-gray-700 hover:text-indigo-600 text-base font-semibold uppercase tracking-wider transition-colors duration-300"
          >
            Men
          </Link>
          <Link 
            to="/collections/all?gender=Women" 
            className="text-gray-700 hover:text-indigo-600 text-base font-semibold uppercase tracking-wider transition-colors duration-300"
          >
            Women
          </Link>
          <Link 
            to="/collections/all?category=Handbags" 
            className="text-gray-700 hover:text-indigo-600 text-base font-semibold uppercase tracking-wider transition-colors duration-300"
          >
            Handbags
          </Link>
          <Link 
            to="/collections/all?category=Backpacks" 
            className="text-gray-700 hover:text-indigo-600 text-base font-semibold uppercase tracking-wider transition-colors duration-300"
          >
            Backpacks
          </Link>
        </div>

        {/* Right Icons & Actions */}
        <div className="flex items-center space-x-5">
          {/* Admin Link */}
          {user && user.role === "admin" && (
            <Link 
              to="/admin" 
              className="hidden sm:block bg-linear-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Admin
            </Link>
          )}

          {/* Profile */}
          <Link 
            to="/profile" 
            className="group p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <HiOutlineUser className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </Link>

          {/* Cart */}
          <button 
            onClick={toggleCart} 
            className="relative group p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search Bar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleNavDrawer} 
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <HiBars3BottomRight className="h-7 w-7 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer (unchanged logic) */}
      <Cart drawerOpen={drawerOpen} toggleCart={toggleCart} />

      {/* Mobile Navigation Drawer - Modern Glassmorphism Style */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${navDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${navDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleNavDrawer}
        />

        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 left-0 w-80 h-full bg-white/95 backdrop-blur-2xl shadow-2xl transform transition-transform duration-500 ease-out ${
            navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Menu
            </h2>
            <button 
              onClick={toggleNavDrawer}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoMdClose className="h-7 w-7 text-gray-600" />
            </button>
          </div>

          <nav className="p-6 space-y-6">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Handbags"
              onClick={toggleNavDrawer}
              className="block text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Handbags
            </Link>
            <Link
              to="/collections/all?category=Backpacks"
              onClick={toggleNavDrawer}
              className="block text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300"
            >
              Backpacks
            </Link>

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                onClick={toggleNavDrawer}
                className="block mt-8 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl text-center font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;