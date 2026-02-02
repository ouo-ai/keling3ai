import { NextResponse } from 'next/server'

const KIE_API_KEY = process.env.KIE_API_KEY

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    }

    const response = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    if (data.code !== 200) {
      return NextResponse.json({ error: data.msg || 'Failed to get status' }, { status: 500 })
    }

    const taskData = data.data
    let videoUrl = null

    // Parse resultJson to get video URL
    if (taskData.state === 'success' && taskData.resultJson) {
      try {
        const result = JSON.parse(taskData.resultJson)
        videoUrl = result.resultUrls?.[0] || result.videoUrl || result.url
      } catch (e) {
        console.error('Failed to parse resultJson:', e)
      }
    }

    return NextResponse.json({
      taskId: taskData.taskId,
      state: taskData.state,
      videoUrl,
      model: taskData.model
    })

  } catch (error) {
    console.error('Status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
