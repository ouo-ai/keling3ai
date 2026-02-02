import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const KIE_API_KEY = process.env.KIE_API_KEY

export async function POST(request) {
  try {
    const { mode, prompt, imageUrl } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (mode === 'image' && !imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    let model, input

    if (mode === 'image') {
      // Image to Video
      model = 'wan/2-6-image-to-video'
      input = {
        prompt,
        image_urls: [imageUrl],
        duration: '5',
        resolution: '720p'
      }
    } else {
      // Text to Video
      model = 'wan/2-5-text-to-video'
      input = {
        prompt,
        duration: '5',
        aspect_ratio: '16:9',
        resolution: '720p'
      }
    }

    const response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, input })
    })

    const data = await response.json()

    if (data.code !== 200) {
      console.error('Kie API error:', data)
      return NextResponse.json({ error: data.msg || 'Failed to create task' }, { status: 500 })
    }

    return NextResponse.json({ 
      taskId: data.data.taskId,
      message: 'Video generation started'
    })

  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
