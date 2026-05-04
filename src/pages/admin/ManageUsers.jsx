/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Toast from '../../components/Toast'
import { useToast } from '../../hooks/useToast'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmRole, setConfirmRole] = useState(null)
  const { toast, showToast, clearToast } = useToast()

  async function fetchUsers() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function doToggleRole() {
    const user = confirmRole
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    setConfirmRole(null)
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    showToast(`เปลี่ยนบทบาท ${user.full_name || user.email} เป็น "${newRole === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}" สำเร็จ`)
    fetchUsers()
  }

  if (loading) return <div className="loading">กำลังโหลดผู้ใช้งาน...</div>

  return (
    <div className="admin-manage">
      <Toast toast={toast} onClose={clearToast} />

      {confirmRole && (
        <div className="confirm-overlay" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="confirm-dialog">
            <h3 id="confirm-title">ยืนยันการเปลี่ยนบทบาท</h3>
            <p>
              ต้องการเปลี่ยนบทบาทของ{' '}
              <strong>{confirmRole.full_name || confirmRole.email}</strong>{' '}
              จาก "{confirmRole.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}" เป็น "{confirmRole.role === 'admin' ? 'ผู้ใช้' : 'ผู้ดูแล'}" ใช่หรือไม่?
            </p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setConfirmRole(null)} className="btn-edit">ยกเลิก</button>
              <button type="button" onClick={doToggleRole} className="btn-primary" style={{ minHeight: '2.35rem', padding: '0.45rem 0.95rem' }}>ยืนยัน</button>
            </div>
          </div>
        </div>
      )}

      <span className="eyebrow">Users</span>
      <h1>จัดการผู้ใช้งาน</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>อีเมล</th>
            <th>บทบาท</th>
            <th>วันที่สมัคร</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name || '-'}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}
                </span>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString('th-TH')}</td>
              <td>
                <button onClick={() => setConfirmRole(user)} className="btn-edit">
                  {user.role === 'admin' ? 'เปลี่ยนเป็นผู้ใช้' : 'เปลี่ยนเป็นผู้ดูแล'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
