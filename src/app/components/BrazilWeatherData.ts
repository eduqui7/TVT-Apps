import { fetchWeatherApi } from 'openmeteo'

const cities = [
  { name: 'São Paulo', lat: -23.5475, lon: -46.6361 },
  { name: 'Rio de Janeiro', lat: -22.9064, lon: -43.1822 },
  { name: 'Brasília', lat: -15.7797, lon: -47.9297 }
]

export async function fetchWeatherData() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const endDate = new Date(tomorrow)
  endDate.setDate(endDate.getDate() + 3) // Changed from +2 to +3

  const params = {
    latitude: cities.map(city => city.lat),
    longitude: cities.map(city => city.lon),
    current: ["temperature_2m", "rain"],
    daily: ["temperature_2m_max", "temperature_2m_min", "rain_sum"],
    timezone: "America/Sao_Paulo",
    start_date: cities.map(() => tomorrow.toISOString().split('T')[0]),
    end_date: cities.map(() => endDate.toISOString().split('T')[0])
  }

  const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", params)
  
  return responses.map((response, index) => {
    const current = response.current()!
    const daily = response.daily()!
    const utcOffsetSeconds = response.utcOffsetSeconds()

    return {
      name: cities[index].name,
      current: {
        temperature: Math.round(current.variables(0)!.value()),
        rain: Math.round(current.variables(1)!.value())
      },
      daily: {
        dates: Array.from({ length: 3 }, (_, i) => 
          new Date((Number(daily.time()) + utcOffsetSeconds + (i + 1) * 86400) * 1000)),
        maxTemp: Array.from(daily.variables(0)!.valuesArray()!).slice(1).map(Math.round),
        minTemp: Array.from(daily.variables(1)!.valuesArray()!).slice(1).map(Math.round),
        rainSum: Array.from(daily.variables(2)!.valuesArray()!).slice(1).map(Math.round)
      }
    }
  })
}

import * as XLSX from 'xlsx'

export function exportToExcel(weatherData: any[]) {
  const workbook = XLSX.utils.book_new()

  const worksheet = XLSX.utils.json_to_sheet(
    weatherData.map(city => ({
      Cidade: city.name,
      'Temperatura Atual': `${city.current.temperature}°C`,
      'Chuva Atual': `${city.current.rain}mm`,
      // Dia 1
      'Data 1': city.daily.dates[0].toLocaleDateString('pt-BR', { weekday: 'short' }),
      'Min 1': `${city.daily.minTemp[0]}°C`,
      'Máx 1': `${city.daily.maxTemp[0]}°C`,
      'Chuva 1': `${city.daily.rainSum[0]}mm`,
      // Dia 2
      'Data 2': city.daily.dates[1].toLocaleDateString('pt-BR', { weekday: 'short' }),
      'Min 2': `${city.daily.minTemp[1]}°C`,
      'Máx 2': `${city.daily.maxTemp[1]}°C`,
      'Chuva 2': `${city.daily.rainSum[1]}mm`,
      // Dia 3
      'Data 3': city.daily.dates[2].toLocaleDateString('pt-BR', { weekday: 'short' }),
      'Min 3': `${city.daily.minTemp[2]}°C`,
      'Máx 3': `${city.daily.maxTemp[2]}°C`,
      'Chuva 3': `${city.daily.rainSum[2]}mm`,
    }))
  )

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão do Tempo')
  XLSX.writeFile(workbook, 'previsao-tempo.xlsx')
}