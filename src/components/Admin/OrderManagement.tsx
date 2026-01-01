import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { Order } from '../../redux/slices/adminOrderSlice';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const OrderManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authState = useSelector((state: RootState) => state.auth);
  const { user } = authState as { user: AuthUser | null };
  const { orders, loading, error } = useSelector((state: RootState) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId: string, status: string): void => {
    dispatch(updateOrderStatus({ id: orderId, status }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading orders... ⏳</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
          <div className="text-red-600 text-3xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Orders</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchAllOrders())}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Retry 🔄
          </button>
        </div>
      </div>
    );
  }

  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Management 📦</h2>
          <p className="text-gray-600">
            Manage <span className="font-semibold text-blue-600">{orders.length}</span> active orders • 
            Total Sales: <span className="font-semibold text-green-600">Rs. {totalSales.toLocaleString('en-IN')}</span>
          </p>
        </div>
        {/* <button
          onClick={() => dispatch(fetchAllOrders())}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <span className="animate-spin">↻</span> Refresh
        </button> */}
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order: Order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-all duration-200">
                    {/* Order ID */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-white font-bold text-sm">#{order._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* ✅ FIXED Customer Column */}
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover shadow-md bg-gray-100 border-2 border-white"
                            src={
                              order.user?.profilePic 
                                ? order.user.profilePic 
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user?.name || 'Customer')}&size=40&background=3b82f6&color=fff`
                            }
                            alt="Customer avatar"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Customer&size=40&background=6b7280&color=fff`;
                            }}
                          />
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {/* ✅ Smart Customer Name Logic */}
                            {order.user?.name || 
                             `Customer #${order._id.slice(-4)}` || 
                             'Anonymous'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      Rs. {order.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2 transition-all w-28"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped 🚚</option>
                          <option value="Delivered">Delivered ✅</option>
                          <option value="Cancelled">Cancelled ❌</option>
                        </select>
                        
                        {order.status !== 'Delivered' && (
                          <button
                            onClick={() => handleStatusChange(order._id, 'Delivered')}
                            className="bg-linear-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-xs font-semibold flex items-center gap-1 ml-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-sm mb-6">Orders will appear here once created.</p>
                      <button
                        onClick={() => dispatch(fetchAllOrders())}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg"
                      >
                        Refresh Orders 🔄
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      {orders.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-linear-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-3xl font-black">{orders.length}</div>
            <div className="text-blue-100 font-medium mt-1">Total Orders</div>
          </div>
          <div className="group bg-linear-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-3xl font-black">Rs. {totalSales.toLocaleString('en-IN')}</div>
            <div className="text-green-100 font-medium mt-1">Total Sales</div>
          </div>
          <div className="group bg-linear-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-3xl font-black">{deliveredCount}</div>
            <div className="text-purple-100 font-medium mt-1">Delivered</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;