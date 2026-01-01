import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../redux/slices/orderSlice';
import type { RootState, AppDispatch } from '../redux/store';

const MyOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-2xl text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            My Orders
          </h2>
          <p className="text-lg text-gray-600">Your shopping journey, beautifully tracked</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl">
            <div className="mb-8">
              <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4a2 2 0 00-2 2v3H10v-3a2 2 0 00-2-2H4" />
              </svg>
            </div>
            <p className="text-3xl text-gray-700 font-medium mb-4">No Orders Yet</p>
            <p className="text-lg text-gray-500 mb-8">Start exploring our collections and make your first purchase!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => handleRowClick(order._id)}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                  <div className="shrink-0">
                    <div className="relative">
                      <img
                        src={order.orderItems[0]?.image || 'https://via.placeholder.com/120'}
                        alt={order.orderItems[0]?.name || 'Product'}
                        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl"
                      />
                      {order.orderItems.length > 1 && (
                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                          +{order.orderItems.length - 1}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                      <div>
                        <p className="text-gray-500 uppercase tracking-wider">Delivery To</p>
                        <p className="font-semibold text-gray-900">
                          {order.shippingAddress
                            ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase tracking-wider">Items</p>
                        <p className="font-bold text-2xl text-gray-900">{order.orderItems.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 uppercase tracking-wider">Total</p>
                        <p className="font-bold text-2xl text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                          Rs. {order.totalPrice?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-6">
                    <span
                      className={`px-6 py-3 rounded-full text-lg font-bold shadow-md ${
                        order.isPaid
                          ? 'bg-linear-to-r from-emerald-100 to-green-100 text-emerald-800'
                          : 'bg-linear-to-r from-amber-100 to-orange-100 text-amber-800'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Pending Payment'}
                    </span>

                    <span className="inline-flex items-center text-indigo-600 font-semibold text-lg group-hover:text-indigo-800 transition-colors">
                      View Details
                      <span className="ml-3 text-2xl transform group-hover:translate-x-3 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;