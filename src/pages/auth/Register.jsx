import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import thailandHero from '../../assets/thailand-hero.png'

const registerPerks = [
  { value: '24+', label: 'เส้นทางคัดสรร' },
  { value: '3-5', label: 'วันเที่ยวพอดี' },
  { value: 'Private', label: 'ดีลเฉพาะสมาชิก' }
]

const previewStops = ['เลือกสไตล์ทริป', 'เก็บแผนที่ชอบ', 'รับข้อเสนอที่ใช่']
const supportPhone = '02-000-0000'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signUp(email, password, fullName, phone)
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
    <div className="auth-container register-page">
      <div className="register-shell">
        <section className="register-visual" aria-label="แรงบันดาลใจทริปไทย">
          <img src={thailandHero} alt="" className="register-visual-image" aria-hidden="true" />
          <div className="register-visual-content">
            <span className="eyebrow">ThaiTrip Passport</span>
            <h1>เปิดประตูสู่ทริปไทยที่เป็นจังหวะของคุณ</h1>
            <p>เก็บไอเดีย เส้นทาง และข้อเสนอพิเศษไว้ในที่เดียว พร้อมกลับมาวางแผนต่อได้ทุกครั้ง</p>
            <div className="register-perks" aria-label="จุดเด่นสำหรับสมาชิก">
              {registerPerks.map((item) => (
                <span key={item.label}>
                  <strong>{item.value}</strong>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="register-pass" aria-hidden="true">
            <span>Next escape</span>
            <strong>Andaman Blue</strong>
            <small>4 วัน 3 คืน / พร้อมดีลส่วนตัว</small>
          </div>
        </section>

        <section className="auth-card register-card">
          <div className="register-card-heading">
            <span className="eyebrow">Create account</span>
            <h2>สมัครใช้งาน</h2>
            <p className="auth-intro">เริ่มวางแผนท่องเที่ยวไทยและติดตามดีลที่เหมาะกับคุณ</p>
          </div>

          <div className="register-steps" aria-label="สิ่งที่จะได้หลังสมัคร">
            {previewStops.map((item, index) => (
              <span key={item}>
                <strong>{index + 1}</strong>
                {item}
              </span>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-full-name">ชื่อ-นามสกุล</label>
              <input
                id="register-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="ชื่อ นามสกุล"
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">อีเมล</label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@thaitrip.studio"
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-phone">เบอร์โทร</label>
              <input
                id="register-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                inputMode="tel"
                placeholder="เช่น 08x-xxx-xxxx"
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">รหัสผ่าน</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="อย่างน้อย 6 ตัวอักษร"
              />
            </div>
            <button type="submit" className="btn-primary register-submit" disabled={loading}>
              {loading ? 'กำลังสมัครใช้งาน...' : 'สร้างบัญชีและเริ่มวางแผน'}
            </button>
          </form>
          <div className="auth-switch">
            <span>มีบัญชีอยู่แล้ว?</span>
            <Link className="auth-switch-button" to="/login">เข้าสู่ระบบ</Link>
          </div>
          <a className="auth-phone" href={`tel:${supportPhone.replaceAll('-', '')}`}>
            โทร {supportPhone}
          </a>
        </section>
      </div>
    </div>
  )
}
