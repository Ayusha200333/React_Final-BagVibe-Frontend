import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

interface ProductImage {
    url: string;
    altText: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    image: ProductImage[];
}

const NewCollections: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const newCollections: Product[] = [
        {
            _id: "1",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=1", altText: "Drawstring Bags" }],
        },
        {
            _id: "2",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=2", altText: "Drawstring Bags" }],
        },
        {
            _id: "3",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=3", altText: "Drawstring Bags" }],
        },
        {
            _id: "4",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=4", altText: "Drawstring Bags" }],
        },
        {
            _id: "5",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=5", altText: "Drawstring Bags" }],
        },
        {
            _id: "6",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=6", altText: "Drawstring Bags" }],
        },
        {
            _id: "7",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=7", altText: "Drawstring Bags" }],
        },
        {
            _id: "8",
            name: "Drawstring Bags",
            price: 2000,
            image: [{ url: "https://picsum.photos/500/500?random=8", altText: "Drawstring Bags" }],
        },
    ];

    // ---- FIX 1: Typed mouse events ----
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;

        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    // ---- FIX 2: Type scroll() argument ----
    const scroll = (direction: "left" | "right") => {
        const scrollAmount = direction === "left" ? -300 : 300;
        scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    const updateScrollButtons = () => {
        const container = scrollRef.current;

        if (container) {
            const leftScroll = container.scrollLeft;
            const rightScrollable =
                container.scrollWidth > leftScroll + container.clientWidth;

            setCanScrollLeft(leftScroll > 0);
            setCanScrollRight(rightScrollable);
        }
    };

    useEffect(() => {
        const container = scrollRef.current;

        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            updateScrollButtons();
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", updateScrollButtons);
            }
        };
    }, []);

    return (
        <section className="py-16 px-4 lg:px-0">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">Unlock New Style</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Explore new bag designs crafted for comfort and style, keeping your look sharp and on-trend.
                </p>

                <div className="absolute right-0 bottom-[-30px] flex space-x-2">
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${
                            canScrollLeft
                                ? "bg-white text-black"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border ${
                            canScrollRight
                                ? "bg-white text-black"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                {newCollections.map((product) => (
                    <div
                        key={product._id}
                        className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
                    >
                        <img
                            src={product.image[0].url}
                            alt={product.image[0].altText}
                            className="w-full h-[290px] object-cover rounded-lg"
                            draggable="false"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className="block">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="mt-1">Rs.{product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewCollections;

