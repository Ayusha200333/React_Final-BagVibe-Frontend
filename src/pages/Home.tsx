import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import MenCollection from "../components/Products/MenCollection";
import NewCollections from "../components/Products/NewCollections";
import ProductDetails from "../components/Products/ProductDetails";
// import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturedSection from "../components/Products/FeaturedSection";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
import axios from "axios";

interface BestSellerProduct {
  _id: string;
}

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useSelector(
    (state: RootState) => state.products
  );

  const [bestSellerProduct, setBestSellerProduct] =
    useState<BestSellerProduct | null>(null);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: "8",
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get<BestSellerProduct>(
  `${import.meta.env.VITE_BACKEND_URL}/api/product/best-sellers`  
);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch best seller product", error);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <MenCollection />
      <NewCollections />

      <h2 className="text-3xl text-center font-bold mb-4">
        Trending Now
      </h2>

      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best seller product...</p>
      )}

      {/* <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Handbags for Women
        </h2>

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
        />
      </div> */}

      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home;
