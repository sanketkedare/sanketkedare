import '../src/index.css'
import '../src/App.scss'

export const metadata = {
  title: 'Sanket Kedare - Full Stack Developer',
  description: 'Portfolio of Sanket Kedare - Full Stack Web Developer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
