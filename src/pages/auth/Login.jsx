import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Toast from '../../components/Toast'
import thailandHero from '../../assets/thailand-hero.png'

const loginHighlights = [
  { value: 'Saved', label: 'แผนที่เลือกไว้' },
  { value: 'Deals', label: 'ข้อเสนอส่วนตัว' },
  { value: 'Ready', label: 'กลับมาจองต่อ' }
]

const supportPhone = '02-000-0000'

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
    <div className="auth-container register-page login-page">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="register-shell login-shell">
        <section className="register-visual login-visual" aria-label="กลับสู่วางแผนทริป">
          <img src={thailandHero} alt="" className="register-visual-image" aria-hidden="true" />
          <div className="register-visual-content">
            <span className="eyebrow">Welcome back</span>
            <h1>กลับเข้ามาต่อทริปที่กำลังจะเกิดขึ้น</h1>
            <p>เปิดแผนเดิม ดูดีลที่พร้อมใช้ และกลับไปเลือกทริปไทยในจังหวะที่คุณวางไว้</p>
            <div className="register-perks" aria-label="สิ่งที่รออยู่ในบัญชี">
              {loginHighlights.map((item) => (
                <span key={item.label}>
                  <strong>{item.value}</strong>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="register-pass" aria-hidden="true">
            <span>Trip status</span>
            <strong>Ready to continue</strong>
            <small>แผนเที่ยว / โปรโมชัน / จุดหมายโปรด</small>
          </div>
        </section>

        <section className="auth-card register-card login-card">
          <div className="register-card-heading">
            <span className="eyebrow">Sign in</span>
            <h2>เข้าสู่ระบบ</h2>
            <p className="auth-intro">กลับไปเลือกแผนเที่ยวไทยและโปรโมชันที่บันทึกไว้</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          <form className="register-form login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">อีเมล</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@thaitrip.studio"
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">รหัสผ่าน</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>
            <button type="submit" className="btn-primary register-submit" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบและดูทริปของฉัน'}
            </button>
          </form>
          <div className="auth-switch">
            <span>ยังไม่มีบัญชี?</span>
            <Link className="auth-switch-button" to="/register">สมัครใช้งาน</Link>
          </div>
          <a className="auth-phone" href={`tel:${supportPhone.replaceAll('-', '')}`}>
            โทร {supportPhone}
          </a>
        </section>
      </div>
    </div>
  )
}
