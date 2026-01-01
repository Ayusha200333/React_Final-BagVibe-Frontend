import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Filters {
  category: string;
  gender: string;
  color: string;
  size: string[];
  material: string[];
  brand: string[];
  minPrice: number;
  maxPrice: number;
}

const FilterSideBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<Filters>({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 1000,
    maxPrice: 10000,
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 10000]);

  const categories = ["Handbags", "Backpacks"];
  const genders = ["Men", "Women"];

  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "Brown", hex: "#8B4513" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#808080" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Red", hex: "#DC2626" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Green", hex: "#16A34A" },
  ];

  const sizes = ["S", "M", "L", "Oversized"];
  const materials = ["Leather", "Denim", "Cotton", "Canvas", "Velvet", "Silk", "Hemp Fabric"];
  const brands = ["Nike", "Adidas", "Puma", "Prada", "Chanel", "Coach"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice ? Number(params.minPrice) : 1000,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 10000,
    });

    setPriceRange([
      params.minPrice ? Number(params.minPrice) : 1000,
      params.maxPrice ? Number(params.maxPrice) : 10000,
    ]);
  }, [searchParams]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (name === "size" || name === "material" || name === "brand") {
        const key = name as "size" | "material" | "brand";
        const currentArray = newFilters[key];

        if (checked) {
          newFilters[key] = [...currentArray, value];
        } else {
          newFilters[key] = currentArray.filter((item) => item !== value);
        }
      }
    } else {
      if (name === "category" || name === "gender" || name === "color") {
        newFilters[name] = value;
      }
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters: Filters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key as keyof Filters];
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (value && !Array.isArray(value)) {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxPrice = Number(e.target.value);
    setPriceRange([1000, newMaxPrice]);

    const newFilters = {
      ...filters,
      minPrice: 1000,
      maxPrice: newMaxPrice,
    };

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handleColorClick = (colorName: string) => {
    const newFilters = {
      ...filters,
      color: filters.color === colorName ? "" : colorName,
    };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <aside className="w-full lg:w-80 bg-white rounded-3xl shadow-2xl p-8 sticky top-24 h-fit">
      <h3 className="text-3xl font-bold text-gray-900 mb-8 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text">
        Filters
      </h3>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Category</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={category}
                onChange={handleFilterChange}
                checked={filters.category === category}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all group-hover:border-indigo-500 ${
                  filters.category === category
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {filters.category === category && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Gender</h4>
        <div className="space-y-3">
          {genders.map((gender) => (
            <label key={gender} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={handleFilterChange}
                checked={filters.gender === gender}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all group-hover:border-purple-500 ${
                  filters.gender === gender
                    ? "border-purple-600 bg-purple-600"
                    : "border-gray-300"
                }`}
              >
                {filters.gender === gender && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition">
                {gender}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Color</h4>
        <div className="grid grid-cols-4 gap-4">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorClick(color.name)}
              className={`relative w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 ${
                filters.color === color.name
                  ? "border-indigo-500 shadow-lg shadow-indigo-300/50"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select ${color.name}`}
            >
              {filters.color === color.name && (
                <div className="absolute inset-0 rounded-full border-4 border-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Material</h4>
        <div className="space-y-3">
          {materials.map((material) => (
            <label key={material} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="material"
                value={material}
                onChange={handleFilterChange}
                checked={filters.material.includes(material)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-md border-2 mr-4 transition-all ${
                  filters.material.includes(material)
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {filters.material.includes(material) && (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition">
                {material}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Brand</h4>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-md border-2 mr-4 transition-all ${
                  filters.brand.includes(brand)
                    ? "bg-linear-to-r from-purple-600 to-pink-600 border-purple-600"
                    : "border-gray-300"
                }`}
              >
                {filters.brand.includes(brand) && (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Size</h4>
        <div className="grid grid-cols-4 gap-3">
          {sizes.map((size) => (
            <label key={size} className="cursor-pointer">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
                className="sr-only"
              />
              <div
                className={`py-3 text-center rounded-xl font-bold text-lg border-2 transition-all ${
                  filters.size.includes(size)
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg"
                    : "bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {size}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-6">Price Range</h4>
        <div className="relative">
          <input
            type="range"
            min={1000}
            max={10000}
            step={500}
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full h-3 bg-linear-to-r from-indigo-200 to-purple-200 rounded-full appearance-none cursor-pointer slider"
          />
          <div
            className="absolute h-6 w-20 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl text-white font-bold flex items-center justify-center text-lg shadow-lg"
            style={{ left: `${((priceRange[1] - 1000) / 9000) * 100}%`, transform: 'translateX(-50%)', top: '-50px' }}
          >
            Rs.{priceRange[1].toLocaleString()}
          </div>
        </div>
        <div className="flex justify-between mt-8 text-gray-600 font-medium">
          <span>Rs.1,000</span>
          <span>Rs.10,000</span>
        </div>
      </div>
    </aside>
  );
};

export default FilterSideBar;