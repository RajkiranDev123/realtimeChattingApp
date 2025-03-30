
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import Email from "./pages/email"
import Otp from "./pages/otp"
import ChangePassword from "./pages/changepassword"



import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/protectedRoute'
import Loader from './components/Loader'
import { useSelector } from "react-redux"

function App() {
  const { loader } = useSelector(state => state.loaderReducer)
  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      {loader && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/email' element={<Email />}></Route>
          <Route path='/otp/:email' element={<Otp />}></Route>
          <Route path='/changePassword/:email' element={<ChangePassword />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
