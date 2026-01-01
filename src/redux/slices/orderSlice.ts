import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface Order {
  _id: string;
  [key: string]: any;
}

export interface OrderDetails {
  _id: string;
  [key: string]: any;
}

interface OrdersState {
  orders: Order[];
  totalOrders: number;
  orderDetails: OrderDetails | null;
  loading: boolean;
  error: string | null;
}

interface ApiError {
  message: string;
}


export const fetchUserOrders = createAsyncThunk<
  Order[],  
  void,
  { rejectValue: ApiError }
>("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    return rejectWithValue(
      error.response?.data || { message: "Something went wrong" }
    );
  }
});

export const fetchOrderDetails = createAsyncThunk<
  any, 
  string, 
  { rejectValue: ApiError }
>("orders/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    return rejectWithValue(
      error.response?.data || { message: "Something went wrong" }
    );
  }
});


const initialState: OrdersState = {
  orders: [],
  totalOrders: 0,
  orderDetails: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;           
        state.totalOrders = action.payload.length;
      })

      .addCase(
        fetchUserOrders.rejected,
        (state, action: PayloadAction<ApiError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Something went wrong";
        }
      )

      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchOrderDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.orderDetails = action.payload;
        }
      )

      .addCase(
        fetchOrderDetails.rejected,
        (state, action: PayloadAction<ApiError | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Something went wrong";
        }
      );
  },
});

export default orderSlice.reducer;
