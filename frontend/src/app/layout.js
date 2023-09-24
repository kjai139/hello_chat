
import '../app/globals.css'
import { Monste } from './fonts'
import { UserProvider } from './_context/authContext'




export const metadata = {
  title: 'HELLO CHAT',
  description: 'Bootleg instant messenger',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${Monste.className}`}>
        <UserProvider>{children}</UserProvider>
        </body>
    </html>
  )
}
