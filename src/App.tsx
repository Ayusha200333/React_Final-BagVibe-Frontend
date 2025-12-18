import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserLayout from './components/Layout/UserLayout'
import Home from './pages/Home'
import { Toaster } from 'sonner'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CollectionPage from './pages/CollectionPage'
import ProductDetails from './components/Products/ProductDetails'
import Checkout from './components/Cart/Checkout'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import MyOrderPage from './pages/MyOrderPage'
import AdminLayout from './components/Admin/AdminLayout'
import AdminHomePage from './pages/AdminHomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter future = {{v7_startTransition:true , v7_relativeSplatPath:true}}>
    <Toaster position='top-right'/>
    <Routes>
      <Route path='/' element={<UserLayout/>}>
        <Route index element={<Home/>}/>
        <Route path='login' element={<LoginPage/>} />
        <Route path='register' element={<RegisterPage/>} />
        <Route path='profile' element={<ProfilePage/>} />
        <Route path='collections/:collection' element={<CollectionPage/>} />
        <Route path="product/:id" element={<ProductDetails/>}/>
        <Route path='checkout' element={<Checkout/>}/>
        <Route path="order-confirmation" element={<OrderConfirmationPage/>}/>
        <Route path="order/:id" element={<OrderDetailsPage/>}/>
        <Route path="my-orders" element={<MyOrderPage/>}/>
      </Route>
      <Route path="/admin" element={<AdminLayout/>}>
        <Route index element={<AdminHomePage/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
