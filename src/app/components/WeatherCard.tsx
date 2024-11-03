import { useState } from 'react'
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm } from 'react-icons/wi'

interface WeatherData {
    current: {
        temperature: number
        weatherCode: number
        feelsLike: number
        time: string
    }
    daily: {
        time: string[]
        weatherCode: number[]
        temperatureMax: number[]
        temperatureMin: number[]
    }
}

const getWeatherIcon = (code: number, size: "large" | "small" = "small") => {
    const iconClass = size === "large" ? "w-24 h-24 text-white" : "w-16 h-16 text-white"

    if (code <= 1) return <WiDaySunny className={iconClass} />
    if (code <= 3) return <WiCloudy className={iconClass} />
    if (code <= 67) return <WiRain className={iconClass} />
    if (code <= 77) return <WiSnow className={iconClass} />
    return <WiThunderstorm className={iconClass} />
}

export default function WeatherCard() {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)

    const getWeather = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.64&hourly=temperature_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/Sao_Paulo'
            )
            const data = await response.json()

            setWeather({
                current: {
                    temperature: data.hourly.temperature_2m[0],
                    weatherCode: data.daily.weather_code[0],
                    feelsLike: data.hourly.apparent_temperature[0],
                    time: data.daily.time[0]
                },
                daily: {
                    time: data.daily.time,
                    weatherCode: data.daily.weather_code,
                    temperatureMax: data.daily.temperature_2m_max,
                    temperatureMin: data.daily.temperature_2m_min
                }
            })
        } catch (error) {
            console.error('Error fetching weather:', error)
        }
        setLoading(false)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', { weekday: 'short' })
    }
      const saveAsHtml = () => {
          const cardHtml = `
              <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="UTF-8">
                  <title>Previsão do Tempo - São Paulo</title>
                  <script src="https://cdn.tailwindcss.com"></script>
              </head>
              <body>
                  <div class="p-8">
                      ${document.querySelector('.max-w-2xl')?.outerHTML}
                  </div>
              </body>
              </html>
          `

          const blob = new Blob([cardHtml], { type: 'text/html' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'previsao-tempo.html'
          link.click()
          window.URL.revokeObjectURL(url)
      }

      return (
          <div className="flex flex-col items-center gap-6">
              <button
                  onClick={getWeather}
                  className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 font-semibold py-3 px-6 rounded-lg text-white"
                  disabled={loading}
              >
                  {loading ? 'Carregando...' : 'Ver Previsão do Tempo'}
              </button>

              {weather && (
                  <>
                      <div className="max-w-2xl w-full mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-2xl p-6 text-white">
                          <div className="space-y-6">
                              {/* Current Weather */}
                              <div className="items-center flex">
                                  <div>
                                      <h3 className="text-3xl font-bold">São Paulo</h3>
                                      <p className="text-5xl font-bold mt-2">{Math.round(weather.current.temperature)}°C</p>
                                      <p className="text-lg opacity-75">Sensação térmica: {Math.round(weather.current.feelsLike)}°C</p>
                                  </div>
                                  <div className="scale-150 pl-11">
                                      {getWeatherIcon(weather.current.weatherCode, "large")}
                                  </div>
                              </div>

                              {/* 5-Day Forecast */}
                              <div className="grid grid-cols-5 gap-4 pt-6 border-t border-white/20">
                                  {weather.daily.time.slice(2, 7).map((day, index) => (
                                      <div key={day} className="text-center p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                                          <p className="font-medium">{formatDate(day)}</p>
                                          {getWeatherIcon(weather.daily.weatherCode[index + 1])}
                                          <div className="mt-2">
                                              <span className="font-bold">{Math.round(weather.daily.temperatureMax[index + 1])}°</span>
                                              <span className="opacity-75 mx-1">/</span>
                                              <span className="opacity-75">{Math.round(weather.daily.temperatureMin[index + 1])}°</span>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                      <button
                          onClick={saveAsHtml}
                          className="bg-green-500 hover:bg-green-600 transition-all duration-200 font-semibold py-3 px-6 rounded-lg text-white"
                      >
                          Salvar Previsão
                      </button>
                  </>
              )}
          </div>
      )
  }
