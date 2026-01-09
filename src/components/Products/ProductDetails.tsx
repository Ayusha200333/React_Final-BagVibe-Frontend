import React, { useEffect, useState } from "react";
import { toast } from "sonner"; //show popup mg
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import type { Product as GridProduct } from "./ProductGrid"; 
import { fetchProductDetails, fetchSimilarProducts } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../../redux/store";

interface DetailedProduct extends GridProduct {
  
  description?: string;
  brand?: string;
  material?: string;
  sizes?: string[];
  colors?: string[];
  discountPrice?: number;
}

interface ProductDetailsProps {
  productId?: string; 
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {  
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
    const productFetchId = productId ?? id;

  
  const { 
    selectedProduct, 
    similarProducts, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.products);

  const { user, guestId } = useSelector((state: RootState) => state.auth);

  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

useEffect(() => {
  if (selectedProduct && selectedProduct.images && selectedProduct.images.length > 0) {
    setMainImage(selectedProduct.images[0].url);
  } else {
    setMainImage("");
  }
}, [selectedProduct]);

  const handleQuantityChange = (action: "plus" | "minus") => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", { duration: 1000 });
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId!,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart", { duration: 1000 });
      })
      .finally(() => setIsButtonDisabled(false));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedProduct) return <p>Product not found.</p>;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images?.length > 0 ? (
              selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === image.url ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image.url)}
                />
              ))
            ) : (
              <p className="text-gray-500">No thumbnails available</p>
            )}
          </div>

          <div className="md:w-1/2 mb-4">
            <img
              src={mainImage || "/placeholder.jpg"}
              alt={selectedProduct.name}
              className="w-full h-auto object-cover rounded-lg"
            />
            {!mainImage && <p className="text-center text-gray-500 mt-4">No image available</p>}
          </div>

          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{selectedProduct.name}</h1>
            
            {selectedProduct.discountPrice ? (
              <>
                <p className="text-lg text-gray-600 mb-1 line-through">Rs.{selectedProduct.price}</p>
                <p className="text-xl text-gray-500 mb-2">Rs.{selectedProduct.discountPrice}</p>
              </>
            ) : (
              <p className="text-xl text-gray-500 mb-2">Rs.{selectedProduct.price}</p>
            )}

            <p className="text-gray-600 mb-4">{selectedProduct.description || "No description available."}</p>

            {selectedProduct.colors?.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color ? "border-4 border-black" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase(), filter: "brightness(0.9)" }}
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.sizes?.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-700">Sizes:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button onClick={() => handleQuantityChange("minus")} className="px-2 py-1 bg-gray-200 rounded text-lg">
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button onClick={() => handleQuantityChange("plus")} className="px-2 py-1 bg-gray-200 rounded text-lg">
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add TO CART"}
            </button>

            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Features:</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  {selectedProduct.brand && (
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                  )}
                  {selectedProduct.material && (
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">Discover More Bags</h2>
          <ProductGrid products={similarProducts as GridProduct[]} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;







