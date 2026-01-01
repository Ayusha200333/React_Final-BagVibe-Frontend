import React, { type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value;

    const newSearchParams = new URLSearchParams(searchParams);
    if (sortBy) {
      newSearchParams.set("sortBy", sortBy);
    } else {
      newSearchParams.delete("sortBy");
    }

    setSearchParams(newSearchParams);
  };

  const currentSort = searchParams.get("sortBy") ?? "";

  return (
    <div className="mb-8 flex items-center justify-end">
      <div className="relative group">
        <select
          id="sort"
          onChange={handleSortChange}
          value={currentSort}
          className="appearance-none bg-white border border-gray-300 rounded-2xl px-8 py-4 pr-12 text-lg font-medium text-gray-800 
                     focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                     transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer
                     bg-linear-to-r hover:from-indigo-50 hover:to-purple-50"
        >
          <option value="">Sort by: Default</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
          <svg
            className="w-6 h-6 text-gray-600 transition-transform duration-300 group-hover:text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <label
          htmlFor="sort"
          className="absolute left-6 -top-3 px-2 bg-white text-sm font-medium text-gray-600 transition-all duration-300"
        >
          Sort By
        </label>
      </div>
    </div>
  );
};

export default SortOptions;