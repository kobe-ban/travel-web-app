import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/user/Home'
import TravelPlans from './pages/user/TravelPlans'
import Promotions from './pages/user/Promotions'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManagePromotions from './pages/admin/ManagePromotions'
import ManageUsers from './pages/admin/ManageUsers'
import ManagePlans from './pages/admin/ManagePlans'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plans" element={<TravelPlans />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/promotions" element={
            <ProtectedRoute adminOnly><ManagePromotions /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/admin/plans" element={
            <ProtectedRoute adminOnly><ManagePlans /></ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
