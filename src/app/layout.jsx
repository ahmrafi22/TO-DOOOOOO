
import { Inter, Press_Start_2P } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"] })

export const metadata = {
  title: "TODOOOOO",
  description: "Animated todo app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${pressStart.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
