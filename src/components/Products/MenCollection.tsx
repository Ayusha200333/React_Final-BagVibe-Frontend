import menCollectionImage from "../../assets/menCollectionImage.webp";
import womenCollectionImage from "../../assets/womenCollectionImage.avif";
import { Link } from 'react-router-dom';

const MenCollection = () => {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-linear-to-b from-gray-50 to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="group relative rounded-3xl overflow-hidden shadow-xl bg-black">
            <img
              src={womenCollectionImage}
              alt="Women's Luxury Bag Collection"
              className="w-full h-[500px] md:h-[600px] lg:h-[650px] object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
                Women’s <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400">Collection</span>
              </h2>

              <p className="text-base md:text-lg font-light mb-8 max-w-md opacity-90">
                Timeless elegance meets modern luxury — crafted for the confident woman.
              </p>

              <Link
                to="/collections/all?gender=Women"
                className="inline-flex items-center px-12 py-5 bg-white text-black font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 hover:bg-gray-100 group-hover:scale-105 min-w-[280px] justify-center"
              >
                Shop Women’s Bags
                <span className="ml-4 text-2xl transform group-hover:translate-x-3 transition-transform">→</span>
              </Link>
            </div>

            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          </div>

          <div className="group relative rounded-3xl overflow-hidden shadow-xl bg-black">
            <img
              src={menCollectionImage}
              alt="Men's Luxury Bag Collection"
              className="w-full h-[500px] md:h-[600px] lg:h-[650px] object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
                Men’s <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-blue-400">Collection</span>
              </h2>

              <p className="text-base md:text-lg font-light mb-8 max-w-md opacity-90">
                Bold, refined, and built to last — elevate your everyday carry.
              </p>

              <Link
                to="/collections/all?gender=Men"
                className="inline-flex items-center px-12 py-5 bg-white text-black font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500 hover:bg-gray-100 group-hover:scale-105 min-w-[280px] justify-center"
              >
                Shop Men’s Bags
                <span className="ml-4 text-2xl transform group-hover:translate-x-3 transition-transform">→</span>
              </Link>
            </div>

            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenCollection;