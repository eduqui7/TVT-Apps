import { NextResponse } from 'next/server'

const TOMORROW_API_KEY = process.env.TOMORROW_API_KEY

export async function GET() {
  if (!TOMORROW_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const locations = [
    { name: 'São Paulo', lat: -23.5475, lon: -46.6361 },
    { name: 'Rio de Janeiro', lat: -22.9064, lon: -43.1822 },
    { name: 'Brasília', lat: -15.7797, lon: -47.9297 }
  ]

  try {
    const weatherData = await Promise.all(
      locations.map(async (location) => {
        try {
          const response = await fetch(
            `https://api.tomorrow.io/v4/weather/forecast?location=${location.lat},${location.lon}&fields=temperature,temperatureMax,temperatureMin&timesteps=1d&units=metric&apikey=${TOMORROW_API_KEY}`
          )
          
          const data = await response.json()
          console.log('API Response:', data) // Add logging to check response structure
          
          if (!data?.data?.timelines?.[0]?.intervals) {
            throw new Error('Invalid API response structure')
          }

          return {
            cityName: location.name,
            current: {
              temperature: data.data.timelines[0].intervals[0].values.temperature
            },
            timelines: {
              daily: data.data.timelines[0].intervals.map((interval: { startTime: string; values: { temperatureMax: number; temperatureMin: number } }) => ({
                time: interval.startTime,
                values: {
                  temperatureMax: interval.values.temperatureMax,
                  temperatureMin: interval.values.temperatureMin
                }
              }))            }
          }
        } catch (locationError) {
          console.error(`Error fetching data for ${location.name}:`, locationError)
          return null
        }
      })
    )

    const validData = weatherData.filter(Boolean)
    return NextResponse.json({ data: validData })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}
