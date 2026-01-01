import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSideBar from '../components/Products/FilterSideBar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import type { AppDispatch, RootState } from '../redux/store';

const CollectionPage: React.FC = () => {
  const { Collection } = useParams<{ Collection?: string }>();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const filters: Record<string, string> = {
      limit: '20', 
    };

    searchParams.forEach((value, key) => {
      filters[key] = value;
    });

    if (Collection && Collection !== 'all') {
      filters.collection = Collection;
    }

    console.log('Dispatching filters:', filters); 
    dispatch(fetchProductsByFilters(filters));
  }, [dispatch, Collection, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-black text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition"
      >
        <FaFilter />
        Filters
      </button>

      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl overflow-y-auto
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:shadow-none lg:w-64 lg:min-h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b lg:hidden relative">
          <h3 className="text-xl font-semibold">Filters</h3>
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-3xl"
          >
            ×
          </button>
        </div>
        <FilterSideBar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="grow p-4 lg:p-8">
        <h2 className="text-3xl font-bold uppercase mb-6 text-center lg:text-left">
          {Collection === 'all' || !Collection ? 'ALL COLLECTION' : Collection}
        </h2>

        <div className="mb-8 flex justify-end">
          <SortOptions />
        </div>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;