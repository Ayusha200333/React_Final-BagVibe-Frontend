import { FaBoxOpen, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa';
import { FaClipboardList } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <div className="w-64 bg-linear-to-b from-gray-900 to-black text-white h-full flex flex-col shadow-2xl">
      <div className="p-8 border-b border-gray-800">
        <Link to="/admin" className="block">
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            BagVibe
          </h1>
          <p className="text-sm text-gray-400 mt-2 text-center">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-3">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30'
                : 'hover:bg-gray-800/70 hover:translate-x-2'
            }`
          }
        >
          <FaUser className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-lg">Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30'
                : 'hover:bg-gray-800/70 hover:translate-x-2'
            }`
          }
        >
          <FaBoxOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-lg">Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30'
                : 'hover:bg-gray-800/70 hover:translate-x-2'
            }`
          }
        >
          <FaClipboardList className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-lg">Orders</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/30'
                : 'hover:bg-gray-800/70 hover:translate-x-2'
            }`
          }
        >
          <FaStore className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-lg">Shop</span>
        </NavLink>
      </nav>

      <div className="p-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center justify-center space-x-4 px-6 py-4 bg-linear-to-r from-red-600 to-pink-600 rounded-2xl font-medium text-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300"
        >
          <FaSignOutAlt className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;