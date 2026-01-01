import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export interface Order {
  user: any;
  customerName: string;
  _id: string;
  totalPrice: number;
  status: string;
  createdAt?: string;
}

interface AdminOrderState {
  orders: Order[];
  totalOrders: number;
  totalSales: number;
  loading: boolean;
  error: string | null;
}


const initialState: AdminOrderState = {
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  loading: false,
  error: null,
};

export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("adminOrders/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Order[]>(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch orders"
    );
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { id: string; status: string },
  { rejectValue: string }
>("adminOrders/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const response = await axios.put<Order>(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Order update failed"
    );
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string }
>("adminOrders/deleteOrder", async ({ id }, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return id;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Delete order failed"
    );
  }
});


const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
          state.totalOrders = action.payload.length;

          const totalSales = action.payload.reduce(
            (acc, order) => acc + order.totalPrice,
            0
          );
          state.totalSales = totalSales;
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load orders";
      })

      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const updatedOrder = action.payload;
          const index = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        }
      )

      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.orders = state.orders.filter(
            (order) => order._id !== action.payload
          );
        }
      );
  },
});

export default adminOrderSlice.reducer;
