/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

const durations = ['ทั้งหมด', '1-2 วัน', '3-4 วัน', '5 วันขึ้นไป']
const planStats = [
  { value: '24+', label: 'เส้นทางคัดสรร' },
  { value: '3-5 วัน', label: 'ช่วงทริปยอดนิยม' },
  { value: 'ไทย', label: 'จุดหมายหลัก' }
]

function getDurationGroup(duration) {
  if (duration <= 2) return '1-2 วัน'
  if (duration <= 4) return '3-4 วัน'
  return '5 วันขึ้นไป'
}

export default function TravelPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [duration, setDuration] = useState('ทั้งหมด')

  async function fetchPlans() {
    setLoading(true)
    setErrorMessage('')

    try {
      const { data, error } = await supabase
        .from('travel_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setPlans([])
        setErrorMessage(`ไม่สามารถโหลดแผนเที่ยวได้ในขณะนี้ (${error.message})`)
        return
      }

      setPlans(data || [])
    } catch (error) {
      setPlans([])
      setErrorMessage(`เชื่อมต่อข้อมูลแผนเที่ยวไม่สำเร็จ (${error.message || 'โปรดลองอีกครั้ง'})`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const text = `${plan.title} ${plan.destination} ${plan.description}`.toLowerCase()
      const matchesQuery = text.includes(query.toLowerCase())
      const matchesDuration = duration === 'ทั้งหมด' || getDurationGroup(Number(plan.duration)) === duration
      return matchesQuery && matchesDuration
    })
  }, [duration, query, plans])

  if (loading) return <div className="loading">กำลังโหลดทริปที่คัดสรร...</div>

  return (
    <div className="plans-page">
      <header className="page-header page-header-immersive">
        <div className="page-header-content">
          <span className="eyebrow">Curated Trips</span>
          <h1>ทริปไทยที่คัดมาอย่างมีรสนิยม</h1>
          <p>ค้นหาจุดหมายหรือคำที่สนใจ แล้วกรองตามจำนวนวันเพื่อเลือกแผนเที่ยวที่เข้ากับจังหวะการเดินทางของคุณ</p>
        </div>
        <div className="page-header-panel" aria-label="ข้อมูลสรุปแผนเที่ยว">
          {planStats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="toolbar plans-search-panel">
        <div className="plans-search-heading">
          <span className="eyebrow">Trip Finder</span>
          <h2>ค้นหาทริปไทย</h2>
          <p>พิมพ์ชื่อเมือง สไตล์ทริป หรือคำที่อยากเจอ แล้วเลือกจำนวนวันที่เหมาะกับจังหวะของคุณ</p>
        </div>
        <div className="plans-search-controls">
          <label className="plans-search-field">
            <span>ค้นหา</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="เช่น เชียงใหม่ ภูเก็ต คาเฟ่ ทะเล"
              aria-label="ค้นหาทริปไทย"
            />
          </label>
          <div className="segmented-control" aria-label="กรองตามจำนวนวัน">
            {durations.map((item) => (
              <button
                key={item}
                type="button"
                className={duration === item ? 'active' : ''}
                onClick={() => setDuration(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage ? (
        <section className="empty-luxury error-state" role="alert" aria-live="assertive">
          <span className="eyebrow">Connection issue</span>
          <h2>โหลดแผนเที่ยวไม่สำเร็จ</h2>
          <p>{errorMessage}</p>
          <button className="btn-primary" type="button" onClick={fetchPlans}>
            ลองโหลดอีกครั้ง
          </button>
        </section>
      ) : plans.length === 0 ? (
        <section className="empty-luxury">
          <span className="eyebrow">Coming soon</span>
          <h2>กำลังคัดสรรทริปใหม่ให้คุณ</h2>
          <p>เมื่อผู้ดูแลเพิ่มแพ็กเกจ ทริปที่พร้อมจองจะปรากฏที่นี่ทันที</p>
        </section>
      ) : filteredPlans.length === 0 ? (
        <section className="empty-luxury">
          <h2>ไม่พบทริปที่ตรงกับเงื่อนไข</h2>
          <p>ลองปรับคำค้นหาหรือจำนวนวัน เพื่อเปิดตัวเลือกที่เหมาะกับคุณมากขึ้น</p>
        </section>
      ) : (
        <div className="plans-grid">
          {filteredPlans.map((plan) => (
            <article key={plan.id} className="plan-card">
              {plan.image_url && <img src={plan.image_url} alt={plan.title} className="plan-image" />}
              <div className="plan-content">
                <div className="card-meta">
                  <span>{plan.destination}</span>
                  <span>{plan.duration} วัน</span>
                </div>
                <h3>{plan.title}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="card-footer">
                  <p className="plan-price">฿{Number(plan.price || 0).toLocaleString('th-TH')}</p>
                  <a className="btn-card" href={`mailto:hello@thaitrip.studio?subject=สนใจทริป ${plan.title}`}>
                    สอบถาม
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
