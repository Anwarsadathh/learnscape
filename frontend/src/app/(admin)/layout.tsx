export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-wrapper">
      {/* Admin-specific UI here */}
      {children}
    </div>
  )
}
