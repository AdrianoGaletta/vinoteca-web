import { CartProvider } from '@/components/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata = {
  title: 'Cava del Plata | Vinoteca Boutique',
  description: 'Selección argentina de vinos premium',
  icons: {
    icon: '/images/logo-favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        <CartProvider>
          <Navbar />
          <main style={{ paddingTop: 0, marginTop: 0, display: 'block' }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}