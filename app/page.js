'use client'
import { useState } from 'react'

export default function Home() {
  const [mode, setMode] = useState('text')
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState('')

  const generateVideo = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress('Submitting task...')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt,
          imageUrl: mode === 'image' ? imageUrl : undefined
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')

      setTaskId(data.taskId)
      setProgress('Processing video...')
      pollStatus(data.taskId)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const pollStatus = async (id) => {
    const maxAttempts = 60
    let attempts = 0

    const check = async () => {
      try {
        const res = await fetch(`/api/status?taskId=${id}`)
        const data = await res.json()

        if (data.state === 'success') {
          setResult(data.videoUrl)
          setLoading(false)
          setProgress('')
        } else if (data.state === 'fail') {
          setError('Video generation failed. Please try again.')
          setLoading(false)
        } else if (attempts < maxAttempts) {
          attempts++
          setProgress(`Generating video... (${Math.min(attempts * 2, 95)}%)`)
          setTimeout(check, 5000)
        } else {
          setError('Generation timeout. Please try again.')
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to check status')
        setLoading(false)
      }
    }

    check()
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}} />

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold">
              <span className="text-purple-400">Kling 3</span>
              <span className="text-cyan-400"> AI</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
              <a href="#generate" className="hover:text-white transition">Generate</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 glow-text">
              Kling 3 AI Video Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-6">
              Create stunning AI-powered videos from text descriptions or images using the latest Kling 3 technology. 
              Transform your creative ideas into professional cinematic content in seconds.
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Kling 3 represents the next generation of AI video synthesis, offering unprecedented quality in motion dynamics, 
              visual realism, and native audio synchronization. Whether you're a content creator, marketer, or filmmaker, 
              Kling 3 empowers you to produce engaging video content without expensive equipment or technical expertise.
            </p>
            <div className="flex justify-center gap-4 text-sm flex-wrap">
              <span className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">✨ Text to Video</span>
              <span className="px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-500/30">🖼️ Image to Video</span>
              <span className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">🎵 Audio Sync</span>
              <span className="px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30">⚡ Fast Generation</span>
            </div>
          </div>

          {/* Generator Card */}
          <div id="generate" className="gradient-border glow max-w-3xl mx-auto mb-20">
            <div className="gradient-border-inner p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Try Kling 3 Video Generator Free</h2>
              
              {/* Mode Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode('text')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                    mode === 'text'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  📝 Text to Video
                </button>
                <button
                  onClick={() => setMode('image')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                    mode === 'image'
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  🖼️ Image to Video
                </button>
              </div>

              {/* Input Fields */}
              <div className="space-y-4 mb-6">
                {mode === 'image' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    {mode === 'text' ? 'Describe your video' : 'Describe the motion'}
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'text' 
                      ? "A majestic eagle soaring through golden sunset clouds, cinematic lighting, 4K quality..."
                      : "The character turns and smiles at the camera, gentle wind blowing..."
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateVideo}
                disabled={loading || !prompt || (mode === 'image' && !imageUrl)}
                className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                  loading || !prompt || (mode === 'image' && !imageUrl)
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {progress}
                  </span>
                ) : (
                  '🚀 Generate with Kling 3'
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Your Kling 3 Video is Ready! 🎉</h3>
                  <video
                    src={result}
                    controls
                    autoPlay
                    loop
                    className="w-full rounded-lg"
                  />
                  <a
                    href={result}
                    download
                    target="_blank"
                    className="inline-block mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition"
                  >
                    ⬇️ Download Video
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What is Kling 3 Section */}
      <section className="py-20 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">What is Kling 3 AI?</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 text-lg mb-6">
              Kling 3 is a state-of-the-art AI video generation model developed to transform text prompts and reference images 
              into high-quality cinematic video content. As the latest iteration in the Kling series, Kling 3 introduces 
              significant improvements in visual fidelity, motion coherence, and audio-video synchronization.
            </p>
            <p className="text-gray-300 text-lg mb-6">
              Unlike traditional video editing software that requires extensive technical knowledge and hours of manual work, 
              Kling 3 AI enables anyone to create professional-looking videos in minutes. Simply describe what you want to see, 
              and the AI handles the complex task of rendering realistic motion, lighting, and scene composition.
            </p>
            <p className="text-gray-300 text-lg">
              The Kling 3 model excels at understanding nuanced prompts, maintaining visual consistency across frames, 
              and generating natural-looking motion that was previously only achievable with expensive production equipment. 
              Whether you need product demos, social media content, or creative storytelling videos, Kling 3 delivers 
              impressive results with minimal effort.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Kling 3 Features</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Discover why Kling 3 is the preferred choice for AI video generation among creators worldwide.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast Generation</h3>
              <p className="text-gray-400">
                Kling 3 processes your requests in seconds, not hours. Advanced optimization techniques ensure 
                you get your video quickly without sacrificing quality. Generate multiple variations and iterate 
                on your creative vision with unprecedented speed.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Cinematic Quality Output</h3>
              <p className="text-gray-400">
                Every video generated by Kling 3 features professional-grade visual quality with stunning 
                clarity and detail. The model understands cinematic principles like composition, lighting, 
                and color grading to produce videos that look professionally shot.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">Native Audio Synchronization</h3>
              <p className="text-gray-400">
                Kling 3 generates videos with perfectly synchronized audio, including ambient sounds, 
                dialogue lip-sync, and background music. This audio-video harmony creates immersive 
                content that engages viewers on multiple sensory levels.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">Text-to-Video Generation</h3>
              <p className="text-gray-400">
                Transform your written descriptions into vivid video content. Kling 3's advanced language 
                understanding captures the essence of your prompts, translating creative concepts into 
                visual storytelling with remarkable accuracy.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🖼️</div>
              <h3 className="text-xl font-bold mb-2">Image-to-Video Animation</h3>
              <p className="text-gray-400">
                Bring static images to life with Kling 3's image-to-video capability. Upload any image 
                and describe the motion you want to see. The AI preserves the original image's style 
                while adding natural, fluid animation.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold mb-2">Diverse Style Support</h3>
              <p className="text-gray-400">
                From photorealistic scenes to anime and illustration styles, Kling 3 adapts to your 
                creative vision. Specify the artistic style you want, and the model delivers consistent 
                results that match your aesthetic preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How Kling 3 Works</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Creating AI videos with Kling 3 is simple and intuitive. Follow these steps to generate your first video.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-purple-500/30">
                1
              </div>
              <h3 className="font-bold mb-2">Choose Your Mode</h3>
              <p className="text-gray-400 text-sm">
                Select Text-to-Video to create from descriptions, or Image-to-Video to animate existing images with Kling 3.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-purple-500/30">
                2
              </div>
              <h3 className="font-bold mb-2">Write Your Prompt</h3>
              <p className="text-gray-400 text-sm">
                Describe the scene you want to create. Be specific about subjects, actions, lighting, and mood for best results.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-purple-500/30">
                3
              </div>
              <h3 className="font-bold mb-2">Generate Video</h3>
              <p className="text-gray-400 text-sm">
                Click generate and let Kling 3 AI work its magic. The process typically takes 30-60 seconds depending on complexity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border border-purple-500/30">
                4
              </div>
              <h3 className="font-bold mb-2">Download & Share</h3>
              <p className="text-gray-400 text-sm">
                Preview your Kling 3 generated video, download it in high quality, and share across your favorite platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Kling 3 Use Cases</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Discover how creators and businesses leverage Kling 3 AI for various video production needs.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
              <h3 className="text-xl font-bold mb-3">📱 Social Media Content</h3>
              <p className="text-gray-400">
                Create eye-catching videos for TikTok, Instagram Reels, and YouTube Shorts. Kling 3 helps you 
                produce trending content that captures attention and drives engagement without expensive production costs.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20">
              <h3 className="text-xl font-bold mb-3">🎬 Marketing Videos</h3>
              <p className="text-gray-400">
                Generate product demonstrations, promotional videos, and advertisement content. Kling 3 enables 
                marketing teams to quickly iterate on video concepts and test different creative approaches.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl border border-green-500/20">
              <h3 className="text-xl font-bold mb-3">📚 Educational Content</h3>
              <p className="text-gray-400">
                Produce engaging educational videos and tutorials. Visualize complex concepts, create animated 
                explanations, and make learning materials more accessible and entertaining with Kling 3.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl border border-orange-500/20">
              <h3 className="text-xl font-bold mb-3">🎨 Creative Projects</h3>
              <p className="text-gray-400">
                Bring your artistic visions to life. Whether you're a filmmaker, artist, or hobbyist, Kling 3 
                provides a canvas for creative experimentation without traditional production constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Kling 3?</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            See how Kling 3 compares to other AI video generation solutions in the market.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4">Feature</th>
                  <th className="py-4 px-4 text-center">Kling 3</th>
                  <th className="py-4 px-4 text-center text-gray-500">Others</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4">Text-to-Video</td>
                  <td className="py-4 px-4 text-center text-green-400">✓</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4">Image-to-Video</td>
                  <td className="py-4 px-4 text-center text-green-400">✓</td>
                  <td className="py-4 px-4 text-center">Limited</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4">Native Audio Generation</td>
                  <td className="py-4 px-4 text-center text-green-400">✓</td>
                  <td className="py-4 px-4 text-center">✗</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4">Free Tier Available</td>
                  <td className="py-4 px-4 text-center text-green-400">✓</td>
                  <td className="py-4 px-4 text-center">Varies</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4">Generation Speed</td>
                  <td className="py-4 px-4 text-center text-green-400">Fast</td>
                  <td className="py-4 px-4 text-center">Moderate</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4">Multiple Style Support</td>
                  <td className="py-4 px-4 text-center text-green-400">✓</td>
                  <td className="py-4 px-4 text-center">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-center mb-12">
            Find answers to common questions about Kling 3 AI video generator.
          </p>
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-bold mb-2">What is Kling 3 AI?</h3>
              <p className="text-gray-400">
                Kling 3 is an advanced AI video generation model that creates high-quality videos from text descriptions 
                or images. It uses cutting-edge machine learning to understand your prompts and generate realistic, 
                cinematic video content with synchronized audio.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-bold mb-2">Is Kling 3 free to use?</h3>
              <p className="text-gray-400">
                Yes, Kling 3 offers a free tier that allows you to generate videos without any payment. 
                This makes it accessible for creators who want to explore AI video generation without 
                financial commitment.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-bold mb-2">How long does Kling 3 take to generate a video?</h3>
              <p className="text-gray-400">
                Kling 3 typically generates videos in 30-60 seconds, depending on the complexity of your prompt 
                and current server load. The optimized pipeline ensures you get results quickly without 
                sacrificing video quality.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-bold mb-2">What video formats does Kling 3 support?</h3>
              <p className="text-gray-400">
                Kling 3 generates videos in standard MP4 format, which is compatible with all major platforms 
                including YouTube, TikTok, Instagram, and most video editing software.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-bold mb-2">Can I use Kling 3 videos commercially?</h3>
              <p className="text-gray-400">
                Videos generated with Kling 3 can be used for personal and commercial projects. However, 
                we recommend reviewing the terms of service for specific use cases and ensuring your 
                content complies with platform guidelines.
              </p>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-bold mb-2">How do I get the best results with Kling 3?</h3>
              <p className="text-gray-400">
                For optimal results, write detailed prompts that describe the scene, subjects, actions, 
                lighting, and mood. Include specific details like camera angles and artistic style. 
                The more descriptive your prompt, the better Kling 3 can interpret your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Creating with Kling 3 Today</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Kling 3 AI to produce stunning video content. 
            No technical skills required – just describe your vision and let AI bring it to life.
          </p>
          <a 
            href="#generate" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-bold text-lg hover:opacity-90 transition"
          >
            Try Kling 3 Free Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-xl font-bold mb-4">
                <span className="text-purple-400">Kling 3</span>
                <span className="text-cyan-400"> AI</span>
              </div>
              <p className="text-gray-500 text-sm">
                Next-generation AI video generation powered by advanced machine learning technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#generate" className="hover:text-white transition">Generate Video</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 Kling 3 AI Video Generator. Powered by WAN 2.5 Technology.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
