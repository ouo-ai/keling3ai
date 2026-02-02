import './globals.css'

export const metadata = {
  title: 'Keling3 AI - Free AI Video Generator',
  description: 'Generate stunning AI videos from text or images. Powered by WAN 2.5 technology.',
  keywords: 'AI video generator, text to video, image to video, AI video, free video generator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="text-white antialiased">{children}</body>
    </html>
  )
}
