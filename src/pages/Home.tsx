import React from 'react'
import Hero from '../components/Layout/Hero'
import MenCollection from '../components/Products/MenCollection'
import NewCollections from '../components/Products/NewCollections'
import ProductDetails from '../components/Products/ProductDetails'

const Home = () => {
  return (
    <div>
        <Hero/>
        <MenCollection/>
        <NewCollections/>

        <h2 className='text-3xl text-center font-bold mb-4'>
          Trending Now
        </h2>

        <ProductDetails/>
    </div>
  )
}

export default Home