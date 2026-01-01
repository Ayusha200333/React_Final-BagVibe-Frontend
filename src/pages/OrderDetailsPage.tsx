import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import type { RootState, AppDispatch } from '../redux/store';

interface OrderDetails {
  _id: string;
  createdAt: string;
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethod: string;
  shippingMethod?: string;
  shippingAddress: {
    city: string;
    country: string;
    [key: string]: any;
  };
  orderItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    [key: string]: any;
  }[];
  totalPrice: number;
  [key: string]: any;
}

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { orderDetails, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-2xl text-gray-700">Loading order details...</p>
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

  const order = orderDetails as OrderDetails | null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Order Details
          </h2>
          <p className="mt-2 text-gray-600">
            Order #{order?._id} • {order && new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {!order ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-xl text-gray-600">Order not found</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-6 rounded-xl shadow text-center ${
                order.isPaid ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
              }`}>
                <p className="text-sm uppercase tracking-wide text-gray-600 mb-1">Payment</p>
                <p className={`text-2xl font-bold ${order.isPaid ? 'text-green-700' : 'text-amber-700'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </p>
              </div>
              <div className={`p-6 rounded-xl shadow text-center ${
                order.isDelivered ? 'bg-green-50 border border-green-200' : 'bg-indigo-50 border border-indigo-200'
              }`}>
                <p className="text-sm uppercase tracking-wide text-gray-600 mb-1">Delivery</p>
                <p className={`text-2xl font-bold ${order.isDelivered ? 'text-green-700' : 'text-indigo-700'}`}>
                  {order.isDelivered ? 'Delivered' : 'In Transit'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 lg:p-8 border-b">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Order Summary</h3>
                <p className="text-gray-600">
                  {order.paymentMethod} • {order.shippingMethod || 'Standard Shipping'}
                </p>
              </div>

              <div className="p-6 lg:p-8 space-y-6">
                {order.orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row gap-6 pb-6 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors block"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Unit price</p>
                          <p className="font-medium">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium text-lg">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Subtotal</p>
                          <p className="font-bold text-indigo-700">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 lg:p-8 bg-gray-50 border-t text-right">
                <p className="text-3xl font-bold text-gray-900">
                  Total: Rs. {order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h4 className="text-lg font-bold mb-4">Shipping Address</h4>
                <p className="text-gray-700 leading-relaxed">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow">
                <h4 className="text-lg font-bold mb-4">Payment Method</h4>
                <p className="text-gray-700">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/my-orders"
                className="inline-flex items-center text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                ← Back to My Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;