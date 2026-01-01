import { FiPhoneCall } from 'react-icons/fi';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-slate-50 to-white border-t border-slate-200">
      <div className="container mx-auto py-16 px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Newsletter</h3>
            <p className="text-gray-600 leading-relaxed">
              Stay connected with our latest collections, special events, and members-only online offers.
            </p>
            <p className="font-semibold text-sm text-indigo-600">
              Join now and enjoy 10% off your first purchase.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-4 text-sm bg-white border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                           transition-all duration-300 shadow-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white 
                           font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 
                           transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Men's Hand Bags
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Women's Hand Bags
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Men's Backpacks
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Women's Backpacks
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-300"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Follow Us</h3>
            <div className="flex items-center space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-indigo-600 transform hover:scale-125 transition-all duration-300"
              >
                <TbBrandMeta className="h-7 w-7" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transform hover:scale-125 transition-all duration-300"
              >
                <IoLogoInstagram className="h-7 w-7" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transform hover:scale-125 transition-all duration-300"
              >
                <RiTwitterXLine className="h-7 w-7" />
              </a>
            </div>

            <div className="mt-8">
              <p className="text-gray-600 font-medium mb-2">Call Us</p>
              <a
                href="tel:0777123456"
                className="inline-flex items-center text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <FiPhoneCall className="mr-3 h-6 w-6" />
                0777 123 456
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-16 pt-8">
        <div className="container mx-auto px-4 lg:px-0 text-center">
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            © 2026 BagVibe — All Rights Reserved. Crafted with ❤️ in Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;