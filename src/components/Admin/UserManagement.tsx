import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser, deleteUser, updateUser, fetchUsers } from '../../redux/slices/adminSlice';
import type { AppDispatch, RootState } from '../../redux/store';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: {
    _id?: string;
    name?: string;
    email?: string;
    role: string;
  } | null;
}

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth as AuthState);
  const { users, loading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addUser(formData));
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const existingUser = users.find((u) => u._id === userId);

    if (existingUser) {
      dispatch(
        updateUser({
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: newRole,
        })
      );
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="mt-4 text-lg text-gray-600">Manage customers and admin accounts</p>
        </div>

        {/* Add New User Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Add New User</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all bg-white shadow-sm"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-10 py-5 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Add New User
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900">All Users</h3>
          </div>

          {loading && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-600"></div>
                <span className="text-xl text-gray-600">Loading users...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-12 text-center">
              <p className="text-xl text-red-600 font-medium">Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-indigo-50 to-purple-50">
                  <tr>
                    <th className="text-left px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="text-left px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="text-left px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="text-center px-8 py-6 text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users && users.length > 0 ? (
                    users.map((user: User) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-8 py-6">
                          <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-gray-700">{user.email}</p>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`px-5 py-3 rounded-xl font-medium transition-all ${
                              user.role === 'admin'
                                ? 'bg-linear-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            } focus:outline-none focus:ring-4 focus:ring-indigo-200`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-8 py-4 bg-linear-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            Delete User
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center">
                        <p className="text-xl text-gray-500">No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;