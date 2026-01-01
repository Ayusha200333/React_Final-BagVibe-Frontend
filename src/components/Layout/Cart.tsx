import React from 'react';
import { IoMdClose } from 'react-icons/io';
import CartContents from '../Cart/CartContents';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface CartProps {
  drawerOpen: boolean;
  toggleCart: () => void;
}

const Cart: React.FC<CartProps> = ({ drawerOpen, toggleCart }) => {
  const navigate = useNavigate();

  const { user, guestId } = useSelector((state: any) => state.auth);
  const { cart } = useSelector((state: any) => state.cart);

  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCart();
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          drawerOpen
            ? 'bg-black/50 backdrop-blur-sm pointer-events-auto opacity-100'
            : 'bg-black/0 pointer-events-none opacity-0'
        }`}
        onClick={toggleCart}
      />

      <div
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl transform transition-transform duration-500 ease-out z-50 flex flex-col ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-300 group"
          >
            <IoMdClose className="h-6 w-6 text-gray-600 group-hover:text-gray-900" />
          </button>
        </div>

        <div className="grow overflow-y-auto p-6">
          {cart && cart?.products?.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-3xl p-12 mb-6">
                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-700">Your cart is empty</p>
              <p className="text-gray-500 mt-2">Explore our collections and add your favorite bags!</p>
            </div>
          )}
        </div>

        {cart && cart?.products?.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100">
            <button
              onClick={handleCheckout}
              className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Proceed to Checkout
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;