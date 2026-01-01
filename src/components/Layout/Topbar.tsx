import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';
import { FiTruck, FiPhone } from 'react-icons/fi';

const Topbar = () => {
  return (
    <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center py-4 px-4 lg:px-8 gap-4 md:gap-0">
        
        <div className="hidden lg:flex items-center space-x-6">
          <span className="text-sm font-medium">Follow us</span>
          <div className="flex items-center space-x-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transform hover:scale-110 transition-all duration-300"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transform hover:scale-110 transition-all duration-300"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-200 transform hover:scale-110 transition-all duration-300"
            >
              <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="text-center flex items-center gap-3 text-sm md:text-base font-medium">
          <FiTruck className="h-5 w-5 animate-pulse" />
          <span>Free Worldwide Shipping on Orders Over $150 – Luxury Delivered to Your Door</span>
        </div>

        <div className="flex items-center gap-2 text-sm md:text-base font-medium">
          <FiPhone className="h-5 w-5" />
          <a 
            href="tel:+94777123456" 
            className="hover:text-gray-200 transition-colors duration-300"
          >
            +94 777 123 456
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;