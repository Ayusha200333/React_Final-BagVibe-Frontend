import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import type { AppDispatch, RootState } from '../../redux/store';
import { createCheckout } from '../../redux/slices/checkoutSlice';

interface Product {
  _id?: string;
  productId?: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  image: string;
  quantity?: number;
}

interface Cart {
  products: Product[];
  totalPrice: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cart, loading: cartLoading, error: cartError } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !cart || cart.products.length === 0) return;

    setIsSubmitting(true);

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products.map((p) => ({
            productId: p.productId || p._id || '',
            name: p.name,
            image: p.image,
            price: p.price,
            quantity: p.quantity ?? 1,
          })),
          shippingAddress: shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        })
      ).unwrap();

      setCheckoutId(res._id);
    } catch (err: any) {
      console.error("Checkout creation failed:", err);
      if (err.message?.includes('401') || err.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
      } else if (err.message?.includes('NetworkError') || !navigator.onLine) {
        alert("Network error. Please check your internet connection.");
      } else {
        alert("Failed to proceed to payment. Please check your details or try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    if (!checkoutId) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "paid", paymentDetails: details },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      } else {
        alert("Payment recorded but something went wrong. Contact support.");
      }
    } catch (error: any) {
      console.error("Payment update failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/order-confirmation");
      } else {
        alert("Order processing failed. Please contact support.");
      }
    } catch (error) {
      console.error("Finalize checkout failed:", error);
      alert("Order processing failed. Please contact support.");
    }
  };

  if (cartLoading) return <div className="text-center py-20 text-xl">Loading your cart...</div>;
  if (cartError) return <div className="text-center py-20 text-xl text-red-600">Error: {cartError}</div>;
  if (!cart || cart.products.length === 0) {
    return <div className="text-center py-20 text-xl">Your cart is empty</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
              <form onSubmit={handleCreateCheckout} className="space-y-8">
                {/* Contact Details */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="mt-10">
                  {!checkoutId ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-2xl'
                      }`}
                    >
                      {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                    </button>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-semibold text-gray-900 text-center">Complete Your Payment</h3>
                      <div className="bg-gray-50 rounded-2xl p-8">
                        <PayPalButton
                          amount={cart.totalPrice}
                          onSuccess={handlePaymentSuccess}
                          onError={() => alert("Payment failed. Please try again.")}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h3>

              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {cart.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-5 pb-6 border-b border-gray-200 last:border-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-28 object-cover rounded-2xl shadow-md"
                      />
                      {product.quantity && product.quantity > 1 && (
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center">
                          {product.quantity}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      {product.size && <p className="text-sm text-gray-500 mt-1">Size: {product.size}</p>}
                      {product.color && <p className="text-sm text-gray-500">Color: {product.color}</p>}
                    </div>
                    <p className="font-bold text-lg text-gray-900">
                      Rs. {(product.price * (product.quantity ?? 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">Rs. {cart.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Rs. {cart.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;