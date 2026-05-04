import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signUp(email, password, fullName)
    if (error) {
      setError(error.message)
    } else {
      navigate('/login', {
        state: {
          toast: {
            message: 'สมัครใช้งานสำเร็จ กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',
            type: 'success'
          }
        }
      })
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span className="eyebrow">Create account</span>
        <h2>สมัครใช้งาน</h2>
        <p className="auth-intro">เริ่มวางแผนท่องเที่ยวไทยและติดตามดีลที่เหมาะกับคุณ</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="ชื่อ นามสกุล"
            />
          </div>
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
              minLength={6}
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'กำลังสมัครใช้งาน...' : 'สมัครใช้งาน'}
          </button>
        </form>
        <p className="auth-link">
          มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  )
}
