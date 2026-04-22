import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Wallet from './pages/Wallet'
import './App.css'

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
