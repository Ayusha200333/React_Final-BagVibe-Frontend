import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/adminProductSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import type { Product } from '../../redux/slices/adminProductSlice';

const ProductManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap(); 
        alert('Product deleted successfully! ✅');
      } catch (err) {
        alert('Failed to delete product. Please try again. ❌');
        dispatch(fetchAdminProducts());
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading products... ⏳</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl max-w-md mx-auto">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchAdminProducts())}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg"
          >
            Retry 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Product Management 🛍️</h2>
          <p className="text-gray-600 mt-2">
            Manage <span className="font-bold text-blue-600">{products.length}</span> products in your store
          </p>
        </div>
        {/* <Link
          to="/admin/products/create"
          className="bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </Link> */}
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-linear-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SKU / Stock
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product: Product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-5">
                      <div className="flex items-center">
                        <div className="shrink-0 h-12 w-12 relative">
                          <img
                            className="h-12 w-12 rounded-lg object-cover shadow-md border-2 border-gray-100"
                            src={
                              product.image
                                ? `${import.meta.env.VITE_BACKEND_URL}${product.image}`
                                : 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image'
                            }
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image';
                            }}
                          />
                          {!product.image && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                              <span className="text-white text-xs font-medium">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                          {product.category && (
                            <div className="text-xs text-gray-500 mt-1">{product.category}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-lg font-bold text-green-600">
                        Rs. {product.price.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        SKU: <span className="font-mono text-gray-600">{product.sku || 'N/A'}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Stock:{' '}
                        <span className={`font-semibold ${product.countInStock && product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.countInStock ?? 0} units
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="bg-linear-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-lg hover:from-yellow-500 hover:to-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-linear-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-3xl flex items-center justify-center shadow-inner">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Yet</h3>
                      <p className="text-gray-600 mb-8 max-w-sm">
                        Start adding products to your store to see them listed here.
                      </p>
                      <Link
                        to="/admin/products/create"
                        className="bg-linear-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center gap-3"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Product
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;