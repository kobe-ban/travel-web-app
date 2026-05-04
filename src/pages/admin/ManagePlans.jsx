/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'

export default function ManagePlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const { toast, showToast, clearToast } = useToast()
  const [form, setForm] = useState({
    title: '',
    destination: '',
    description: '',
    duration: '',
    price: '',
    image_url: ''
  })

  async function fetchPlans() {
    const { data } = await supabase
      .from('travel_plans')
      .select('*')
      .order('created_at', { ascending: false })
    setPlans(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  function resetForm() {
    setForm({ title: '', destination: '', description: '', duration: '', price: '', image_url: '' })
    setEditingPlan(null)
    setShowForm(false)
  }

  function handleEdit(plan) {
    setForm({
      title: plan.title,
      destination: plan.destination,
      description: plan.description,
      duration: plan.duration,
      price: plan.price,
      image_url: plan.image_url || ''
    })
    setEditingPlan(plan)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const planData = {
      ...form,
      duration: Number(form.duration),
      price: Number(form.price)
    }

    if (editingPlan) {
      await supabase.from('travel_plans').update(planData).eq('id', editingPlan.id)
      showToast(`อัปเดตแผนเที่ยว "${form.title}" สำเร็จ`)
    } else {
      await supabase.from('travel_plans').insert([planData])
      showToast(`เพิ่มแผนเที่ยว "${form.title}" สำเร็จ`)
    }

    resetForm()
    fetchPlans()
  }

  async function doDelete() {
    const plan = confirmDelete
    setConfirmDelete(null)
    await supabase.from('travel_plans').delete().eq('id', plan.id)
    showToast(`ลบแผนเที่ยว "${plan.title}" สำเร็จ`)
    fetchPlans()
  }

  if (loading) return <div className="loading">กำลังโหลดแผนเที่ยว...</div>

  return (
    <div className="admin-manage">
      <Toast toast={toast} onClose={clearToast} />

      {confirmDelete && (
        <div className="confirm-overlay" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="confirm-dialog">
            <h3 id="confirm-title">ยืนยันการลบ</h3>
            <p>ต้องการลบแผนเที่ยว "{confirmDelete.title}" ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้</p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setConfirmDelete(null)} className="btn-edit">ยกเลิก</button>
              <button type="button" onClick={doDelete} className="btn-delete">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-header">
        <div>
          <span className="eyebrow">Plans</span>
          <h1>จัดการแผนเที่ยว</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'ยกเลิก' : '+ เพิ่มแผนเที่ยว'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>ชื่อแผน</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>จุดหมาย</label>
            <input type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>รายละเอียด</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>จำนวนวัน</label>
              <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required min="1" />
            </div>
            <div className="form-group">
              <label>ราคา (บาท)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>URL รูปภาพ</label>
            <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">
            {editingPlan ? 'อัปเดต' : 'เพิ่มแผนเที่ยว'}
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>จุดหมาย</th>
            <th>ระยะเวลา</th>
            <th>ราคา</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td>{plan.title}</td>
              <td>{plan.destination}</td>
              <td>{plan.duration} วัน</td>
              <td>{plan.price?.toLocaleString('th-TH')} บาท</td>
              <td className="actions">
                <button onClick={() => handleEdit(plan)} className="btn-edit">แก้ไข</button>
                <button onClick={() => setConfirmDelete(plan)} className="btn-delete">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
