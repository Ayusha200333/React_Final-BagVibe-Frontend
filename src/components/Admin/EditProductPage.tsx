import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';
import axios from 'axios';
import type { AppDispatch, RootState } from '../../redux/store';

interface ProductImage {
  url: string;
  altText?: string;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  sku: string;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  collections: string;
  material: string;
  gender: string;
  images: ProductImage[];
}

type RawSelectedProduct = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  sku: string;
  category: string;
  brand: string;
  sizes?: string[] | null;
  colors?: string[] | null;
  collections: string;
  material: string;
  gender: string;
  images?: (string | { url: string; altText?: string })[] | null;
};

const EditProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { selectedProduct, loading, error } = useSelector((state: RootState) => state.products);

  const [productData, setProductData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: []
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      const raw = selectedProduct as RawSelectedProduct;

      const normalizedImages: ProductImage[] = Array.isArray(raw.images)
        ? raw.images
            .filter((img): img is string | {
                altText: string; url: string 
} => !!img)
            .map((img) =>
              typeof img === 'string'
                ? { url: img, altText: '' }
                : { url: img.url || '', altText: img.altText || '' }
            )
        : [];

      setProductData({
        ...raw,
        sizes: Array.isArray(raw.sizes) ? raw.sizes : [],
        colors: Array.isArray(raw.colors) ? raw.colors : [],
        images: normalizedImages,
      });
    }
  }, [selectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'countInStock' ? Number(value) || 0 : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post<{ imageUrl: string }>(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProductData(prev => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));

      e.target.value = '';
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p className="text-center text-xl py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 text-xl py-10">Error: {error}</p>;

  return (
    <div className='max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl'>
      <h2 className='text-3xl font-bold mb-8 text-gray-800'>Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className='block font-semibold mb-2 text-gray-700'>Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent'
            required
          />
        </div>

        <div>
          <label className='block font-semibold mb-2 text-gray-700'>Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500'
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className='block font-semibold mb-2 text-gray-700'>Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500'
              required
            />
          </div>

          <div>
            <label className='block font-semibold mb-2 text-gray-700'>Count in Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              min="0"
              className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500'
              required
            />
          </div>
        </div>

        <div>
          <label className='block font-semibold mb-2 text-gray-700'>SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500'
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className='block font-semibold mb-2 text-gray-700'>
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              value={productData.sizes.join(", ")}
              onChange={(e) =>
                setProductData(prev => ({
                  ...prev,
                  sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                }))
              }
              placeholder="S, M, L, XL"
              className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500'
            />
          </div>

          <div>
            <label className='block font-semibold mb-2 text-gray-700'>
              Colors (comma-separated)
            </label>
            <input
              type="text"
              value={productData.colors.join(", ")}
              onChange={(e) =>
                setProductData(prev => ({
                  ...prev,
                  colors: e.target.value.split(",").map(c => c.trim()).filter(Boolean),
                }))
              }
              placeholder="Black, White, Red"
              className='w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-500'
            />
          </div>
        </div>

        <div>
          <label className='block font-semibold mb-2 text-gray-700'>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className='block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100'
          />
          {uploading && <p className="mt-2 text-blue-600">Uploading image...</p>}

          {productData.images.length > 0 && (
            <div className='flex flex-wrap gap-4 mt-6'>
              {productData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.altText || "Product Image"}
                    className='w-32 h-32 object-cover rounded-lg shadow-md border-2 border-gray-200'
                  />
                  <button
                    type="button"
                    onClick={() => setProductData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className='w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          {uploading ? 'Uploading Image...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;