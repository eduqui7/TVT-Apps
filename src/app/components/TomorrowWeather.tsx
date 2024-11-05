import { useState } from 'react'
import * as XLSX from 'xlsx'

interface WeatherData {
  cityName: string
  current: {
    temperature: number
  }
  timelines: {
    daily: {
      time: string
      values: {
        temperatureMax: number
        temperatureMin: number
      }
    }[]
  }
}

export default function TomorrowWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/tomorrow-weather')
      const data = await response.json()
      // Initialize empty array if data is undefined
      setWeatherData(data?.data || [])
    } catch (error) {
      console.error('Error fetching weather:', error)
      setWeatherData([]) // Set empty array on error
    }
    setLoading(false)
  }


  const exportToExcel = () => {
    const exportData = weatherData.flatMap(city => [
      {
        Cidade: city.cityName,
        Data: 'Atual',
        'Temperatura Atual': `${Math.round(city.current.temperature)}°C`,
        'Temperatura Máxima': '-',
        'Temperatura Mínima': '-'
      },
      ...city.timelines.daily.slice(0, 4).map(day => ({
        Cidade: city.cityName,
        Data: new Date(day.time).toLocaleDateString('pt-BR', {
          weekday: 'short'
        }),
        'Temperatura Atual': '-',
        'Temperatura Máxima': `${Math.round(day.values.temperatureMax)}°C`,
        'Temperatura Mínima': `${Math.round(day.values.temperatureMin)}°C`
      }))
    ])

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão do Tempo')
    XLSX.writeFile(workbook, 'previsao-tempo.xlsx')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Previsão do Tempo - Tomorrow.io</h1>
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Atualizar Previsão'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weatherData.map((city) => (
          <div key={city.cityName} 
               className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
              <h2 className="text-2xl font-bold text-white">{city.cityName}</h2>
            </div>
            
            <div className="p-4">
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold">Temperatura Atual</p>
                <p className="text-2xl font-bold">{Math.round(city.current.temperature)}°C</p>
              </div>

              {city.timelines.daily.slice(0, 4).map((day) => (
                <div key={day.time} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">
                    {new Date(day.time).toLocaleDateString('pt-BR', {
                      weekday: 'short'
                    })}
                  </p>
                  <div className="mt-2">
                    <p>Máx: {Math.round(day.values.temperatureMax)}°C</p>
                    <p>Mín: {Math.round(day.values.temperatureMin)}°C</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {weatherData.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Exportar para Excel
          </button>
        </div>
      )}
    </div>
  )
}
