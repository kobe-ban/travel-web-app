/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPromo, setEditingPromo] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, showToast, clearToast } = useToast()
  const [form, setForm] = useState({
    title: '',
    description: '',
    discount: '',
    start_date: '',
    end_date: '',
    image_url: '',
    is_active: true
  })

  async function fetchPromotions() {
    const { data } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })
    setPromotions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  function resetForm() {
    setForm({ title: '', description: '', discount: '', start_date: '', end_date: '', image_url: '', is_active: true })
    setEditingPromo(null)
    setShowForm(false)
  }

  function handleEdit(promo) {
    setForm({
      title: promo.title,
      description: promo.description,
      discount: promo.discount,
      start_date: promo.start_date,
      end_date: promo.end_date,
      image_url: promo.image_url || '',
      is_active: promo.is_active
    })
    setEditingPromo(promo)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const promoData = {
      ...form,
      discount: Number(form.discount)
    }

    if (editingPromo) {
      await supabase.from('promotions').update(promoData).eq('id', editingPromo.id)
      showToast(`อัปเดตโปรโมชัน "${form.title}" สำเร็จ`)
    } else {
      await supabase.from('promotions').insert([promoData])
      showToast(`เพิ่มโปรโมชัน "${form.title}" สำเร็จ`)
    }

    resetForm()
    fetchPromotions()
  }

  async function doDelete() {
    const promo = confirmDelete
    setConfirmDelete(null)
    await supabase.from('promotions').delete().eq('id', promo.id)
    showToast(`ลบโปรโมชัน "${promo.title}" สำเร็จ`)
    fetchPromotions()
  }

  async function toggleActive(promo) {
    const next = !promo.is_active
    await supabase.from('promotions').update({ is_active: next }).eq('id', promo.id)
    showToast(`${next ? 'เปิด' : 'ปิด'}ใช้งานโปรโมชัน "${promo.title}" สำเร็จ`)
    fetchPromotions()
  }

  if (loading) return <div className="loading">กำลังโหลดโปรโมชัน...</div>

  return (
    <div className="admin-manage">
      <Toast toast={toast} onClose={clearToast} />

      {confirmDelete && (
        <div className="confirm-overlay" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="confirm-dialog">
            <h3 id="confirm-title">ยืนยันการลบ</h3>
            <p>ต้องการลบโปรโมชัน "{confirmDelete.title}" ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้</p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setConfirmDelete(null)} className="btn-edit">ยกเลิก</button>
              <button type="button" onClick={doDelete} className="btn-delete">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div>
          <span className="eyebrow">Promotions</span>
          <h1>จัดการโปรโมชัน</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'ยกเลิก' : '+ เพิ่มโปรโมชัน'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>ชื่อโปรโมชัน</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>รายละเอียด</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ส่วนลด (%)</label>
              <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} required min="1" max="100" />
            </div>
            <div className="form-group">
              <label>วันเริ่มต้น</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>วันสิ้นสุด</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>URL รูปภาพ</label>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              เปิดใช้งาน
            </label>
          </div>
          <button type="submit" className="btn-primary">
            {editingPromo ? 'อัปเดต' : 'เพิ่มโปรโมชัน'}
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>ส่วนลด</th>
            <th>ช่วงเวลา</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promo) => (
            <tr key={promo.id}>
              <td>{promo.title}</td>
              <td>{promo.discount}%</td>
              <td>{new Date(promo.start_date).toLocaleDateString('th-TH')} - {new Date(promo.end_date).toLocaleDateString('th-TH')}</td>
              <td>
                <button onClick={() => toggleActive(promo)} className={`status-badge ${promo.is_active ? 'active' : 'inactive'}`}>
                  {promo.is_active ? 'เปิด' : 'ปิด'}
                </button>
              </td>
              <td className="actions">
                <button onClick={() => handleEdit(promo)} className="btn-edit">แก้ไข</button>
                <button onClick={() => setConfirmDelete(promo)} className="btn-delete">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
