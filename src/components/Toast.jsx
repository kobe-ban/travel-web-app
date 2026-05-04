export default function Toast({ toast, onClose }) {
  if (!toast) return null
  const isError = toast.type === 'error'
  const isInfo = toast.type === 'info'
  const label = isError ? 'ผิดพลาด' : isInfo ? 'แจ้งเตือน' : 'สำเร็จ'

  return (
    <div className={`app-toast ${toast.type || 'success'}`} role="status" aria-live="polite">
      <strong>{label}</strong>
      <span>{toast.message}</span>
      <button type="button" aria-label="ปิดข้อความแจ้งเตือน" onClick={onClose}>×</button>
    </div>
  )
}
