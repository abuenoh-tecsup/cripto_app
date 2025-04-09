import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {DepositForm} from "./pages/DepositForm"
import {Home} from "./pages/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/home"/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/deposit' element={<DepositForm/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
