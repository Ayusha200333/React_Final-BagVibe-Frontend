import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

interface ProductImage {
  url: string;
  altText?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: ProductImage[];
}


const NewCollections: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newCollections, setNewCollections] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNewCollections = async () => {
      try {
        setLoading(true);

        const response = await axios.get<Product[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/new-arrivals`
        );

        const validProducts: Product[] = response.data
          .map((product) => ({
            ...product,
            images:
              product.images?.filter(
                (img) => img.url && img.url.trim() !== ""
              ) || [],
          }))
          .filter((product) => product.images.length > 0);

        setNewCollections(validProducts);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCollections();
  }, []);


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollWidth > scrollLeft + clientWidth + 10);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();
    return () =>
      container.removeEventListener("scroll", updateScrollButtons);
  }, [newCollections]);


  if (loading) {
    return <div className="py-16 text-center">Loading new collections...</div>;
  }

  if (newCollections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 lg:px-0 bg-gray-50">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Unlock New Style</h2>
        <p className="text-lg text-gray-600 mb-8">
          Explore new bag designs crafted for comfort and style.
        </p>

        <div className="absolute right-0 bottom-[-30px] flex space-x-2 z-10">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full border shadow-md ${
              canScrollLeft
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-3 rounded-full border shadow-md ${
              canScrollRight
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-auto flex space-x-6 pb-6 hide-scrollbar ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newCollections.map((product) => {
          const firstImage = product.images[0];

          return (
            <div
              key={product._id}
              className="min-w-full sm:min-w-[50%] lg:min-w-[30%]"
            >
              <Link to={`/product/${product._id}`} className="block group">
                <div className="relative overflow-hidden rounded-lg">
                  {firstImage?.url && (
                    <img
                      src={firstImage.url}
                      alt={firstImage.altText || product.name}
                      className="w-full h-[290px] object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      draggable={false}
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <p className="text-xl font-bold mt-1">Rs. {product.price}</p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NewCollections;













