import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductImage {
  url: string;
  altText?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  sizes: string[];
  colors: string[];
  gender?: string;
  material?: string;
  collections?: string;
  category?: string;
  images: ProductImage[];
  [key: string]: any;
}

interface Filters {
  category: string;
  size: string;
  color: string;
  gender: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  search: string;
  material: string;
  collection: string;
}

interface ProductsState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  similarProducts: IProduct[];
  loading: boolean;
  error: string | null;
  filters: Filters;
}

interface FetchProductsParams {
  collection?: string;
  size?: string;
  color?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  search?: string;
  category?: string;
  material?: string;
  brand?: string;
  limit?: string;
}


export const fetchProductsByFilters = createAsyncThunk<
  IProduct[],
  FetchProductsParams
>("products/fetchByFilters", async (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });
  const response = await axios.get<IProduct[]>(
    `${import.meta.env.VITE_BACKEND_URL}/api/product?${query.toString()}`
  );
  return response.data;
});

export const fetchProductDetails = createAsyncThunk<IProduct, string>(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get<IProduct>(
      `${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<
  IProduct,
  { id: string; productData: Partial<IProduct> }
>("products/updateProduct", async ({ id, productData }) => {
  const response = await axios.put<IProduct>(
    `${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return response.data;
});

export const fetchSimilarProducts = createAsyncThunk<IProduct[], { id: string }>(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get<IProduct[]>(
      `${import.meta.env.VITE_BACKEND_URL}/api/product/similar/${id}`
    );
    return response.data;
  }
);

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    collection: "",
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { ...initialState.filters };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product details";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch similar products";
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;