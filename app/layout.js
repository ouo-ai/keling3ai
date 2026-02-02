import './globals.css'

export const metadata = {
  title: 'Kling 3 AI Video Generator - Free Text to Video & Image to Video',
  description: 'Create stunning AI videos with Kling 3 - the advanced AI video generator. Transform text descriptions or images into cinematic videos with native audio sync. Free to use, fast generation, professional quality.',
  keywords: 'Kling 3, AI video generator, text to video, image to video, AI video, free video generator, Kling AI, video generation, AI video maker',
  openGraph: {
    title: 'Kling 3 AI Video Generator - Free Text to Video & Image to Video',
    description: 'Create stunning AI videos with Kling 3. Transform text or images into cinematic videos with native audio sync.',
    url: 'https://keling3ai.co',
    siteName: 'Kling 3 AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kling 3 AI Video Generator',
    description: 'Create stunning AI videos with Kling 3. Text to video & image to video generation.',
  },
  alternates: {
    canonical: 'https://keling3ai.co',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Kling 3 AI Video Generator',
              description: 'Advanced AI video generation tool that creates cinematic videos from text descriptions or images.',
              url: 'https://keling3ai.co',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Text to Video Generation',
                'Image to Video Animation',
                'Native Audio Synchronization',
                'Multiple Style Support',
                'Fast Generation Speed',
              ],
            }),
          }}
        />
      </head>
      <body className="text-white antialiased">{children}</body>
    </html>
  )
}
