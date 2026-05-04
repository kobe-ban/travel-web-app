import { Link } from 'react-router-dom'

const destinations = ['เชียงใหม่', 'ภูเก็ต', 'กระบี่', 'อยุธยา']
const highlights = [
  { value: '24+', label: 'Curated routes' },
  { value: '3-5', label: 'Day escapes' },
  { value: 'TH', label: 'Local focus' }
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <section className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="brand-mark">T</span>
            <span>
              ThaiTrip Studio
              <small>Curated Thailand journeys</small>
            </span>
          </Link>
          <p>
            บริการคัดสรรแผนท่องเที่ยวไทยสำหรับคนที่อยากเดินทางอย่างมีรสนิยม เห็นรายละเอียดชัด และเลือกทริปได้อย่างมั่นใจ
          </p>
          <div className="footer-highlights" aria-label="ThaiTrip Studio highlights">
            {highlights.map((item) => (
              <span key={item.label}>
                <strong>{item.value}</strong>
                {item.label}
              </span>
            ))}
          </div>
        </section>

        <section className="footer-column">
          <h2>สำรวจ</h2>
          <Link to="/">หน้าแรก</Link>
          <Link to="/plans">แผนการท่องเที่ยว</Link>
          <Link to="/promotions">ข้อเสนอพิเศษ</Link>
        </section>

        <section className="footer-column">
          <h2>จุดหมาย</h2>
          <div className="footer-destinations">
            {destinations.map((destination) => (
              <Link key={destination} to="/plans">{destination}</Link>
            ))}
          </div>
        </section>

        <section className="footer-column footer-contact">
          <h2>ติดต่อ</h2>
          <a href="mailto:hello@thaitrip.studio">hello@thaitrip.studio</a>
          <a href="tel:+6620000000">02-000-0000</a>
          <span>ทุกวัน 09:00-18:00</span>
        </section>
      </div>

      <div className="footer-bottom">
        <span>© 2026 ThaiTrip Studio</span>
        <span>Curated in Thailand</span>
      </div>
    </footer>
  )
}
