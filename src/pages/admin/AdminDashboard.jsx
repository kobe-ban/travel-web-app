import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header className="page-header page-header-immersive">
        <span className="eyebrow">Admin</span>
        <h1>แผงควบคุมผู้ดูแลระบบ</h1>
        <p>จัดการแผนเที่ยว โปรโมชัน และสิทธิ์ผู้ใช้งานทั้งหมดผ่านแผงควบคุมนี้</p>
      </header>
      <div className="admin-grid">
        <Link to="/admin/plans" className="admin-card">
          <h3>จัดการแผนเที่ยว</h3>
          <p>เพิ่ม แก้ไข และจัดการแพ็กเกจท่องเที่ยวไทยที่จะแสดงให้ผู้ใช้เห็น</p>
        </Link>
        <Link to="/admin/promotions" className="admin-card">
          <h3>จัดการโปรโมชัน</h3>
          <p>สร้างดีล กำหนดช่วงเวลา และเปิดปิดสถานะโปรโมชันได้ทันที</p>
        </Link>
        <Link to="/admin/users" className="admin-card">
          <h3>จัดการผู้ใช้งาน</h3>
          <p>ดูรายชื่อผู้ใช้และปรับสิทธิ์ผู้ดูแลระบบเมื่อจำเป็น</p>
        </Link>
      </div>
    </div>
  )
}
