import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface CheckoutData {
  checkoutItems: { productId: string; name: string; image: string; price: number; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  totalPrice: number;
}

interface CheckoutResponse {
  _id: string;
  checkoutItems: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  paymentMethod?: string;
  totalPrice: number;
  paymentStatus: string;
  isPaid: boolean;
  isFinalized?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CheckoutState {
  checkout: CheckoutResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: CheckoutState = {
  checkout: null,
  loading: false,
  error: null,
};

export const createCheckout = createAsyncThunk<
  CheckoutResponse, 
  CheckoutData,     
  { rejectValue: { message: string } } 
>(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post<CheckoutResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCheckout.fulfilled,
        (state, action: PayloadAction<CheckoutResponse>) => {
          state.loading = false;
          state.checkout = action.payload;
        }
      )
      .addCase(
        createCheckout.rejected,
        (state, action: PayloadAction<{ message: string } | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Something went wrong";
        }
      );
  },
});

export default checkoutSlice.reducer;