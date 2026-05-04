/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const promoStats = [
  { value: 'Private', label: 'ข้อเสนอพิเศษ' },
  { value: 'Active', label: 'พร้อมใช้ตอนนี้' },
  { value: 'TH', label: 'เที่ยวไทยคุ้มค่า' }
]

export default function Promotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function fetchPromotions() {
    setLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        setPromotions([])
        setErrorMessage(`ไม่สามารถโหลดข้อเสนอพิเศษได้ในขณะนี้ (${error.message})`)
        return
      }

      setPromotions(data || [])
    } catch (error) {
      setPromotions([])
      setErrorMessage(`เชื่อมต่อข้อมูลโปรโมชันไม่สำเร็จ (${error.message || 'โปรดลองอีกครั้ง'})`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  if (loading) return <div className="loading">กำลังโหลดข้อเสนอพิเศษ...</div>

  return (
    <div className="promotions-page">
      <header className="page-header page-header-immersive">
        <div className="hero-skyline" aria-hidden="true" />
        <div className="page-header-content">
          <span className="eyebrow">Private Offers</span>
          <h1>ข้อเสนอพิเศษสำหรับเที่ยวไทย</h1>
          <p>ดีลที่เปิดใช้งานอยู่จะแสดงที่นี่ พร้อมช่วงเวลาและรายละเอียดสำหรับวางแผนทริปอย่างคุ้มค่า</p>
          <div className="hero-actions">
            <Link className="btn-primary" to="/plans">สำรวจทริป</Link>
            <a className="btn-ghost" href="mailto:hello@thaitrip.studio?subject=สอบถามโปรโมชัน">สอบถามดีล</a>
          </div>
        </div>
        <div className="page-header-panel promotions-header-panel" aria-label="ข้อมูลสรุปโปรโมชัน">
          {promoStats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="section-separator section-separator-warm" aria-hidden="true">
        <span />
      </div>

      <section className="promotions-intro">
        <span className="eyebrow">Deal Board</span>
        <h2>โปรเที่ยวไทยที่น่าจองตอนนี้</h2>
        <p>เลือกดีลที่ตรงกับช่วงเดินทาง แล้วใช้เป็นจุดเริ่มต้นในการวางแผนทริปที่คุ้มและดูพิเศษขึ้นตั้งแต่หน้าแรก</p>
      </section>

      {errorMessage ? (
        <section className="empty-luxury error-state" role="alert" aria-live="assertive">
          <span className="eyebrow">Connection issue</span>
          <h2>โหลดข้อเสนอพิเศษไม่สำเร็จ</h2>
          <p>{errorMessage}</p>
          <button className="btn-primary" type="button" onClick={fetchPromotions}>
            ลองโหลดอีกครั้ง
          </button>
        </section>
      ) : promotions.length === 0 ? (
        <section className="empty-luxury">
          <span className="eyebrow">No active offers</span>
          <h2>ยังไม่มีข้อเสนอที่เปิดใช้งานในขณะนี้</h2>
          <p>โปรโมชั่นใหม่จะถูกเผยแพร่ทันทีเมื่อพร้อมสำหรับการเดินทาง</p>
        </section>
      ) : (
        <div className="promotions-grid">
          {promotions.map((promo) => (
            <article key={promo.id} className="promo-card">
              {promo.image_url && <img src={promo.image_url} alt={promo.title} className="promo-image" />}
              <div className="promo-content">
                <span className="promo-badge">ลด {promo.discount}%</span>
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
                <p className="promo-period">
                  ใช้ได้ {new Date(promo.start_date).toLocaleDateString('th-TH')} - {new Date(promo.end_date).toLocaleDateString('th-TH')}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
