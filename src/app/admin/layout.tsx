/**
 * Admin Layout — Route Isolation
 *
 * Next.js App Router does not allow nested layouts to re-define <html>/<body>.
 * Instead, this layout uses a fixed full-screen overlay that visually replaces
 * the root shell (Navbar, Footer, Sidebar, ChatWidget).
 *
 * The overlay sits at z-[9999] and covers the entire viewport, so public UI
 * elements are completely hidden while the admin portal is active.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050511',
        overflowY: 'auto',
      }}
    >
      {children}
    </div>
  );
}
