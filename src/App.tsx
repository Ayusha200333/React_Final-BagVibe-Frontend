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

      </Route>
      <Route>{/*Admin layout*/}</Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
