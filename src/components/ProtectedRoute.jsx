import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, userRole, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ toast: { message: 'กรุณาเข้าสู่ระบบก่อนเข้าใช้งานหน้านี้', type: 'info' } }}
        replace
      />
    )
  }

  if (adminOnly && userRole !== 'admin') {
    return (
      <Navigate
        to="/"
        state={{ toast: { message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้', type: 'error' }, from: location.pathname }}
        replace
      />
    )
  }

  return children
}
