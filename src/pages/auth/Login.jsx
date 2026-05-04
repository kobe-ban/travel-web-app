import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Toast from '../../components/Toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const [toast, setToast] = useState(location.state?.toast || null)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!toast) return undefined

    const timer = setTimeout(() => {
      setToast(null)
    }, 5200)

    return () => clearTimeout(timer)
  }, [toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h2>เข้าสู่ระบบ</h2>
        <p className="auth-intro">กลับไปเลือกแผนเที่ยวไทยและโปรโมชันที่บันทึกไว้</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@thaitrip.studio"
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="กรอกรหัสผ่าน"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="auth-link">
          ยังไม่มีบัญชี? <Link to="/register">สมัครใช้งาน</Link>
        </p>
      </div>
    </div>
  )
}
