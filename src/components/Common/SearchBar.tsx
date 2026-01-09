import  { useState, type FormEvent } from 'react';
import { HiMagnifyingGlass, HiMiniXMark } from 'react-icons/hi2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilters, setFilters } from '../../redux/slices/productsSlice';
import type { AppDispatch } from '../../redux/store';

interface FilterParams {
  search?: string;
  [key: string]: any;
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) return;

    const filters: FilterParams = { search: trimmedTerm };

    dispatch(setFilters(filters));
    dispatch(fetchProductsByFilters(filters));

    navigate(`/collections/all?search=${encodeURIComponent(trimmedTerm)}`);
    
    setIsOpen(false);
    setSearchTerm(''); 
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleClose}
        />
      )}

      <div className="relative flex items-center">
        {!isOpen && (
          <button
            onClick={handleSearchToggle}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 group"
            aria-label="Open search"
          >
            <HiMagnifyingGlass className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
          </button>
        )}

        {isOpen && (
          <div
            className="fixed inset-x-0 top-0 bg-white shadow-lg z-50 lg:relative lg:inset-auto lg:top-auto lg:shadow-none lg:bg-transparent"
          >
            <div className="container mx-auto px-4 py-4 lg:py-0">
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search bags, backpacks, accessories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full px-6 py-4 pl-14 pr-12 bg-gray-100 rounded-full text-gray-900 placeholder-gray-500 
                             focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:bg-white 
                             transition-all duration-300 shadow-inner text-lg"
                />

                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <HiMagnifyingGlass className="h-7 w-7" />
                </div>

                <button type="submit" className="sr-only">
                  Search
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
                             hover:bg-gray-200 transition-colors duration-300 group"
                  aria-label="Close search"
                >
                  <HiMiniXMark className="h-7 w-7 text-gray-600 group-hover:text-gray-900" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;