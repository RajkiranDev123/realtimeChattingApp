import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/protectedRoute'

function App() {


  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
