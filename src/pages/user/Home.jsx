import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Toast from '../../components/Toast'
import thailandHero from '../../assets/thailand-hero.png'

const defaultHeroTitle = 'เที่ยวไทยแบบมีแผน เลือกทริปสวย จองได้จริง'

const heroSlides = [
  {
    action: 'สำรวจทริป',
    to: '/plans',
    image: thailandHero,
    eyebrow: 'Curated Thailand Journeys',
    title: defaultHeroTitle,
    text: 'ค้นหาจุดหมายหรือสไตล์ที่อยากไป แล้วกรองแผนเที่ยวตามจำนวนวัน เพื่อเจอทริปที่เข้ากับจังหวะการเดินทางของคุณ',
    tone: 'sea'
  },
  {
    action: 'ดูดีลวันนี้',
    to: '/promotions',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Private Offers',
    title: 'ดีลเที่ยวไทยคุ้มค่า เลือกง่าย ออกเดินทางได้ทันที',
    text: 'รวมโปรโมชั่นและช่วงเวลาน่าไป เพื่อให้คุณเลือกทริปที่คุ้มค่าแต่ยังดูพิเศษตั้งแต่หน้าแรก',
    tone: 'deal'
  },
  {
    action: 'เริ่มวางแผน',
    to: '/register',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'Plan Your Moment',
    title: 'วางแผนทริปในแบบคุณ เก็บไอเดีย จองได้มั่นใจ',
    text: 'เก็บแรงบันดาลใจ เลือกสไตล์การเดินทาง และกลับมาต่อยอดแผนเที่ยวได้อย่างมั่นใจทุกครั้ง',
    tone: 'plan'
  }
]

const signatureTrips = [
  {
    title: 'Andaman Blue Escape',
    location: 'ภูเก็ต / กระบี่',
    duration: '4 วัน 3 คืน',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=82',
    tone: 'ทะเลสีเทอร์ควอยซ์ เรือหางยาว จุดชมพระอาทิตย์ตก และรีสอร์ตริมอ่าว',
    highlights: ['เกาะพีพี', 'พายคายัค', 'ดินเนอร์ริมทะเล']
  },
  {
    title: 'Northern Slow Living',
    location: 'เชียงใหม่ / น่าน',
    duration: '5 วัน 4 คืน',
    image: 'https://images.unsplash.com/photo-1598970605070-a38a6ccd3a2d?auto=format&fit=crop&w=1200&q=82',
    tone: 'ภูเขา คาเฟ่ งานคราฟต์ หมอกเช้า และชุมชนท้องถิ่นที่อบอุ่น',
    highlights: ['ดอยอินทนนท์', 'คาเฟ่วิวเขา', 'หมู่บ้านงานคราฟต์']
  },
  {
    title: 'Heritage Weekend',
    location: 'อยุธยา / กรุงเทพฯ',
    duration: '3 วัน 2 คืน',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=82',
    tone: 'เมืองเก่า อาหารท้องถิ่น แสงเย็นริมแม่น้ำ และประวัติศาสตร์ใกล้ตัว',
    highlights: ['วัดไชยวัฒนาราม', 'ล่องเรือเย็น', 'ตลาดท้องถิ่น']
  }
]

const specialOffers = [
  {
    badge: 'จันทร์-พฤหัส',
    title: 'Weekday Wonder',
    discount: 'ราคาพิเศษ',
    period: 'สำหรับการเดินทางวันธรรมดา',
    text: 'เหมาะกับคนที่อยากเที่ยววันธรรมดา คนไม่แน่น โรงแรมราคาดี และมีเวลาซึมซับเมืองแบบช้า ๆ',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=82'
  },
  {
    badge: 'ศุกร์-อาทิตย์',
    title: 'Weekend Quick Trip',
    discount: 'ประหยัดทันที',
    period: 'สำหรับทริป 3 วัน 2 คืน',
    text: 'แพ็กทริปสั้นสำหรับวันหยุดสุดสัปดาห์ เลือกง่าย เดินทางไว และยังได้รูปสวยกลับมาเต็มเครื่อง',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82'
  },
  {
    badge: 'วันหยุดยาว',
    title: 'Long Weekend Escape',
    discount: 'อัปเกรดฟรี',
    period: 'จำนวนจำกัดในช่วงวันหยุด',
    text: 'โปรสำหรับวางแผนล่วงหน้า ได้ห้องพักดีขึ้นหรือกิจกรรมพิเศษเพิ่มในเส้นทางยอดนิยม',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=82'
  }
]

const moments = [
  { stat: '24+', label: 'เส้นทางคัดสรร' },
  { stat: '3-5 วัน', label: 'จังหวะทริปยอดนิยม' },
  { stat: 'ไทย', label: 'จุดหมายหลัก' }
]

function SectionSeparator({ tone = 'cool' }) {
  return (
    <div className={`section-separator section-separator-${tone}`} aria-hidden="true">
      <span />
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const location = useLocation()
  const [heroProgress, setHeroProgress] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)
  const [toast, setToast] = useState(location.state?.toast || null)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 5200)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    let frame = 0
    const updateHero = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const progress = Math.min(window.scrollY / 420, 1)
        const nextSlide = progress < 0.34 ? 0 : progress < 0.72 ? 1 : 2
        setHeroProgress(progress)
        setActiveSlide(nextSlide)
      })
    }

    updateHero()
    window.addEventListener('scroll', updateHero, { passive: true })
    window.addEventListener('resize', updateHero)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateHero)
      window.removeEventListener('resize', updateHero)
    }
  }, [])

  const slide = heroSlides[activeSlide]
  const heroTitle = slide?.title || defaultHeroTitle
  const actions = user ? heroSlides.slice(0, 2) : heroSlides

  return (
    <div className="home-page" style={{ '--hero-progress': heroProgress }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <section className={`hero-section hero-tone-${slide.tone}`}>
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((item, index) => (
            <div
              className={`hero-slide ${activeSlide === index ? 'is-active' : ''}`}
              key={item.action}
              style={{ backgroundImage: `url(${item.image})` }}
            />
          ))}
        </div>
        <div className="hero-skyline" aria-hidden="true" />
        <div className="hero-content">
          <span className="eyebrow">{slide.eyebrow}</span>
          <h1 aria-live="polite">{heroTitle}</h1>
          <p>{slide.text}</p>
          <div className="hero-actions" aria-label="เลือกภาพและเส้นทางหลัก">
            {actions.map((item, index) => (
              <Link
                key={item.action}
                to={item.to}
                className={index === activeSlide ? 'btn-primary is-active' : index === 1 ? 'btn-secondary' : 'btn-ghost'}
                onFocus={() => setActiveSlide(index)}
                onMouseEnter={() => setActiveSlide(index)}
              >
                {item.action}
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-panel" aria-label="ข้อมูลสรุปบริการ">
          {moments.map((item) => (
            <div key={item.label}>
              <strong>{item.stat}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-dots" aria-label="สไลด์ภาพ hero">
          {heroSlides.map((item, index) => (
            <button
              aria-label={`ดูภาพ ${index + 1}: ${item.action}`}
              className={activeSlide === index ? 'is-active' : ''}
              key={item.action}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>
      </section>

      <SectionSeparator />

      <section className="signature-section" id="travel-plans">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Featured Itineraries</span>
            <h2>สำรวจทริปและเลือกแผนท่องเที่ยวที่อยากจอง</h2>
          </div>
          <Link to="/plans" className="section-action">ดูแผนเพิ่มเติม</Link>
        </div>
        <div className="signature-grid">
          {signatureTrips.map((trip) => (
            <article className="signature-card" key={trip.title}>
              <img src={trip.image} alt={trip.title} className="signature-image" />
              <div className="signature-content">
                <div className="signature-meta">
                  <span>{trip.location}</span>
                  <strong>{trip.duration}</strong>
                </div>
                <h3>{trip.title}</h3>
                <p>{trip.tone}</p>
                <div className="signature-tags" aria-label={`ไฮไลต์ของ ${trip.title}`}>
                  {trip.highlights.map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>
                <div className="signature-footer">
                  <Link className="btn-card" to="/plans">
                    สำรวจแผนทริป
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionSeparator tone="warm" />

      <section className="offers-section" id="special-offers">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Special Offers</span>
            <h2>ข้อเสนอพิเศษ โปรสำหรับวันต่าง ๆ</h2>
          </div>
          <Link to="/promotions" className="section-action section-action-warm">ดูโปรทั้งหมด</Link>
        </div>
        <div className="offers-grid">
          {specialOffers.map((offer) => (
            <article className="offer-card" key={offer.title}>
              <img src={offer.image} alt={offer.title} className="offer-image" />
              <div className="offer-content">
                <div className="offer-topline">
                  <span>{offer.badge}</span>
                  <strong>{offer.discount}</strong>
                </div>
                <h3>{offer.title}</h3>
                <p>{offer.text}</p>
                <div className="offer-footer">
                  <span>{offer.period}</span>
                  <Link to="/promotions" className="btn-card">ดูโปรโมชัน</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  )
}
