import React from 'react'
import heroImg from "../../assets/herolmg-jpg.webp";
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
   <section className="relative">
      <img
        src={heroImg}
        alt="BagVibe"
        className="w-full h-[200px] md:h-[300px] lg:h-[500px] object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase">
            Bag Away
          </h1>

          <p className='text-sm tracking-tighter md:text-lg mb-6'>
                Stylish bags for every journey  - comfort, quality, and adventure.
          </p>

          <Link to="#" className='bg-white text-gray-950 px-6 py-2 rounded-sm text-lg'>
            Go Explore
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero