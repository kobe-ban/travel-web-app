import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'หน้าแรก', section: 'home' },
  { to: '/plans', label: 'แผนการท่องเที่ยว', section: 'plans' },
  { to: '/promotions', label: 'ข้อเสนอพิเศษ', section: 'promotions' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { user, userRole, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const updateHeader = () => {
      setScrolled(window.scrollY > 28)

      if (!isHome) {
        setActiveSection('home')
        return
      }

      const travelPlans = document.querySelector('#travel-plans')
      const specialOffers = document.querySelector('#special-offers')
      if (!travelPlans) {
        setActiveSection('home')
        return
      }

      const topOffset = 120
      const plansRect = travelPlans.getBoundingClientRect()
      const offersRect = specialOffers?.getBoundingClientRect()

      if (offersRect && offersRect.top <= topOffset) {
        setActiveSection('promotions')
      } else {
        setActiveSection(plansRect.top <= topOffset ? 'plans' : 'home')
      }
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader)
    return () => {
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
    }
  }, [isHome])

  const closeMenu = () => setOpen(false)

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
    navigate('/login')
  }

  const getNavClass = (item, isActive) => {
    if (isHome) {
      if (activeSection === item.section) return 'active'
      if (item.to === '/' && activeSection !== 'home') return undefined
    }

    return isActive ? 'active' : undefined
  }

  return (
    <header className={`site-header ${isHome ? 'on-hero' : ''} ${scrolled || open ? 'is-scrolled' : ''}`}>
      <nav className="navbar" aria-label="เมนูหลัก">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <span className="brand-mark">T</span>
            <span>
              ThaiTrip Studio
              <small>Curated Thailand Journeys</small>
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => getNavClass(item, isActive)}
              key={item.to}
              to={item.to}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
          {user && userRole === 'admin' && (
            <NavLink to="/admin" className="admin-link" onClick={closeMenu}>
              ผู้ดูแล
            </NavLink>
          )}
          <div className="nav-actions">
            {user ? (
              <button onClick={handleSignOut} className="btn-logout">ออกจากระบบ</button>
            ) : (
              <>
                <Link to="/register" className="btn-nav-secondary" onClick={closeMenu}>สมัครสมาชิก</Link>
                <Link to="/login" className="btn-login" onClick={closeMenu}>เข้าสู่ระบบ</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
