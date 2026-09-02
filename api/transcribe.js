export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }
  try {
    const body = req.body
    const audioBase64 = body.audioBase64
    const apiKey = body.apiKey
    if (!audioBase64 || !apiKey) {
      return res.status(400).json({ error: 'Missing params' })
    }
    const audioBuffer = Buffer.from(audioBase64, 'base64')
    const url = 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?topic=general&lang=ru-RU'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Api-Key ' + apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: audioBuffer
    })
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
