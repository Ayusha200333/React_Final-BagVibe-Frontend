import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL as string;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;


export interface Product {
  sku: string;
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  countInStock?: number;
}

interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}


const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
};


export const fetchAdminProducts = createAsyncThunk<Product[]>(
  "adminProducts/fetchProducts",
  async () => {
    const response = await axios.get<Product[]>(
      `${API_URL}/api/admin/products`,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data;
  }
);

export const createProduct = createAsyncThunk<Product, Partial<Product>>(
  "adminProducts/createProduct",
  async (productData) => {
    const response = await axios.post<Product>(
      `${API_URL}/api/admin/products`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN,
        },
      }
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: Partial<Product> }
>("adminProducts/updateProduct", async ({ id, productData }) => {
  const response = await axios.put<Product>(
    `${API_URL}/api/admin/products/${id}`,
    productData,
    {
      headers: {
        Authorization: USER_TOKEN,
      },
    }
  );
  return response.data;
});

// export const deleteProduct = createAsyncThunk<string, string>(
//   "adminProducts/deleteProduct",
//   async (id) => {
//     await axios.delete(`${API_URL}/api/admin/products/${id}`, {
//       headers: {
//         Authorization: USER_TOKEN,
//       },
//     });
//     return id;
//   }
// );

export const deleteProduct = createAsyncThunk<string, string>(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/api/product/${id}`, 
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);



const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload);
        }
      )

      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (product) => product._id === action.payload._id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )

      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.products = state.products.filter(
            (product) => product._id !== action.payload
          );
        }
      );
  },
});

export default adminProductSlice.reducer;
