import React, { useState } from 'react'
import { HiOutlineUser,HiOutlineShoppingBag } from 'react-icons/hi'
import { HiBars3BottomRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import Cart from '../Layout/Cart'

const Navbar = () => {
    const [drawerOpen , setDrawerOpen] = useState(false)
    
        const toogleCart = () => {
            setDrawerOpen(!drawerOpen)
        }

  return (
    <>
        <nav className='container mx-auto flex items-center justify-between py-4 px-6'>
            <div>
                <Link to="/" className='text-2xl font-medium'>
                    BagVibe
                </Link>
            </div>
            <div className='hidden md:flex space-x-6'>
                <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Men
                </Link>
                <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Women
                </Link>
                <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Handbags
                </Link>
                <Link to="#" className='text-gray-700 hover:text-black text-sm font-medium uppercase'>
                    Backpacks
                </Link>
            </div>

            <div className="flex items-center space-x-4">
                <Link to="/profile" className='hover:text-black'>
                    <HiOutlineUser className='h-6 w-6 text-gray-700'/>
                </Link>

                <button onClick={toogleCart} className='relative hover:text-black'>
                    <HiOutlineShoppingBag className='h-6 w-6 text-gray-700'/>
                    <span className='absolute -top-1 bg-[tomato] text-white text-xs rounded-full px-2 py-0.5'>
                        4
                    </span>
                </button>

                <div className='overflow-hidden'>
                   <SearchBar/>
                </div>

                <button className='md:hidden'>
                    <HiBars3BottomRight className='h-6 w-6 text-gray-700'/>
                </button>
            </div>
        </nav>

        <Cart drawerOpen={drawerOpen} toogleCart={toogleCart}/>
    </>
  )
}

export default Navbar