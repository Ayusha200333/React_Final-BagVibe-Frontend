import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  [key: string]: any;
}

interface Cart {
  products: CartItem[];
  [key: string]: any;
}

interface CartState {
  items: any;
  cart: Cart;
  loading: boolean;
  error: string | null;
}

// Thunk argument types
interface FetchCartArgs {
  userId?: string;
  guestId?: string;
}

interface AddToCartArgs {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

interface UpdateCartItemQuantityArgs {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

interface RemoveFromCartArgs {
  productId: string;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

interface MergeCartArgs {
  guestId: string;
  userId: string;
}

const loadCartFromStorage = (): Cart => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

const saveCartToStorage = (cart: Cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const fetchCart = createAsyncThunk<Cart, FetchCartArgs>(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch cart" });
    }
  }
);

export const addToCart = createAsyncThunk<Cart, AddToCartArgs>(
  "cart/addToCart",
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Failed to add to cart" });
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk<Cart, UpdateCartItemQuantityArgs>(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Failed to update item quantity" });
    }
  }
);

export const removeFromCart = createAsyncThunk<Cart, RemoveFromCartArgs>(
  "cart/removeFromCart",
  async ({ productId, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        data: { productId, size, color, guestId, userId },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Failed to remove items" });
    }
  }
);

export const mergeCart = createAsyncThunk<Cart, MergeCartArgs>(
  "cart/mergeCart",
  async ({ guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Failed to merge cart" });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  } as CartState,
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to fetch cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to add to cart";
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to update item quantity";
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to remove items";
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
