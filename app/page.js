'use client'
import { useState } from 'react'

export default function Home() {
  const [mode, setMode] = useState('text') // 'text' or 'image'
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

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          {/* Header */}
          <nav className="flex justify-between items-center mb-20">
            <div className="text-2xl font-bold">
              <span className="text-purple-400">Keling3</span>
              <span className="text-cyan-400">AI</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#generate" className="hover:text-white transition">Generate</a>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              AI Video Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8">
              Transform your ideas into stunning videos with the power of AI.
              <span className="text-purple-400"> Free to use.</span>
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">✨ Text to Video</span>
              <span className="px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-500/30">🖼️ Image to Video</span>
              <span className="px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">🎵 With Audio</span>
            </div>
          </div>

          {/* Generator Card */}
          <div id="generate" className="gradient-border glow max-w-3xl mx-auto">
            <div className="gradient-border-inner p-8">
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
                  '🚀 Generate Video'
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
                  <h3 className="text-lg font-medium mb-3">Your Video is Ready! 🎉</h3>
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

      {/* Features Section */}
      <div id="features" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Keling3 AI?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">Generate videos in seconds with our optimized AI pipeline.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Cinematic Quality</h3>
            <p className="text-gray-400">Professional-grade videos with stunning visual effects.</p>
          </div>
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-bold mb-2">Audio Sync</h3>
            <p className="text-gray-400">Native audio generation synchronized with your video.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 Keling3 AI. Powered by WAN 2.5 Technology.</p>
        </div>
      </footer>
    </main>
  )
}
