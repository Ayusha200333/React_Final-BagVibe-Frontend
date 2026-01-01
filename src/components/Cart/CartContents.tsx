import React from 'react';
import { RiDeleteBin3Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

interface CartItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface Cart {
  products: CartItem[];
}

interface CartContentsProps {
  cart: Cart | null;
  userId: string | null;
  guestId: string | null;
}

const CartContents: React.FC<CartContentsProps> = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch<any>(); 

  const handleQuantityChange = (
    productId: string,
    delta: number,
    currentQuantity: number,
    size: string,
    color: string
  ) => {
    const newQuantity = currentQuantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId: guestId ?? undefined,
          userId: userId ?? undefined,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId: string, size: string, color: string) => {
    dispatch(
      removeFromCart({
        productId,
        size,
        color,
        guestId: guestId ?? undefined,
        userId: userId ?? undefined,
      })
    );
  };

  const cartProducts = cart?.products ?? [];

  return (
    <div className="space-y-6">
      {cartProducts.map((product, index) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}-${index}`}
          className="flex items-start justify-between py-6 border-b border-gray-200 last:border-b-0"
        >
          <div className="flex items-start gap-5 flex-1">
            <div className="relative">
              <img
                src={product.image || '/fallback-image.jpg'}
                alt={product.name}
                className="w-28 h-36 object-cover rounded-2xl shadow-md shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/fallback-image.jpg';
                }}
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Size: <span className="font-medium">{product.size}</span> | Color: <span className="font-medium">{product.color}</span>
              </p>

              <div className="flex items-center mt-4 gap-4">
                <button
                  onClick={() =>
                    handleQuantityChange(product.productId, -1, product.quantity, product.size, product.color)
                  }
                  disabled={product.quantity <= 1}
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-xl font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>

                <span className="w-12 text-center text-lg font-semibold">{product.quantity}</span>

                <button
                  onClick={() =>
                    handleQuantityChange(product.productId, +1, product.quantity, product.size, product.color)
                  }
                  className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center text-xl font-medium hover:bg-gray-100 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end gap-4">
            <p className="font-bold text-xl text-gray-900">
              Rs. {(product.price * product.quantity).toLocaleString()}
            </p>

            <button
              onClick={() => handleRemoveFromCart(product.productId, product.size, product.color)}
              className="p-3 rounded-full hover:bg-red-50 transition group"
              aria-label="Remove item from cart"
            >
              <RiDeleteBin3Line className="h-6 w-6 text-red-600 group-hover:text-red-700 transition" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;