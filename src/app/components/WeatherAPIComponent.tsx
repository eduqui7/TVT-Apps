'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'

interface WeatherData {
  name: string;
  current: {
    temperature: number;
    rain: number;
  };
  daily: {
    dates: Date[];
    minTemp: number[];
    maxTemp: number[];
  };
}

export default function WeatherAPIComponent() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([])

    const exportToExcel = (data: WeatherData[]) => {
        const workbook = XLSX.utils.book_new()
        
        const allCitiesData = data.flatMap(city => 
            city.daily.dates.map((date, index) => ({
                'Cidade': city.name,
                'Data': date.toLocaleDateString('pt-BR'),
                'Temperatura Mínima': city.daily.minTemp[index],
                'Temperatura Máxima': city.daily.maxTemp[index],
                'Temperatura Atual': city.current.temperature,
                'Chuva (mm)': city.current.rain
            }))
        )
        
        const worksheet = XLSX.utils.json_to_sheet(allCitiesData)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Previsão do Tempo')
        
        XLSX.writeFile(workbook, 'previsao-tempo.xlsx')
    }

    interface DailyDataItem {
        temps: number[]
        date: Date
    }

    interface DailyDataMap {
        [key: string]: DailyDataItem
    }

    const fetchWeatherAPI = async () => {
        const cities = [
            { name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
            { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
            { name: 'Brasilia', lat: -15.7975, lon: -47.8919 }
        ]
        const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        
        try {
            const weatherPromises = cities.map(async (city) => {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
                )
                const currentData = await response.json()
    
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
                )
                const forecastData = await forecastResponse.json()
                
                const dailyData: DailyDataMap = forecastData.list.reduce((acc: DailyDataMap, item: any) => {
                    const date = new Date(item.dt * 1000).toDateString()
                    if (!acc[date]) {
                        acc[date] = {
                            temps: [],
                            date: new Date(item.dt * 1000)
                        }
                    }
                    acc[date].temps.push(item.main.temp)
                    return acc
                }, {})
    
                const nextDays = Object.values(dailyData).slice(1, 4)
                
                return {
                    name: city.name,
                    current: {
                        temperature: Math.round(currentData.main.temp),
                        rain: Math.round((currentData.rain?.['1h'] || 0) * 100) / 100
                    },
                    daily: {
                        dates: nextDays.map((day) => day.date),
                        minTemp: nextDays.map((day) => Math.round(Math.min(...day.temps))),
                        maxTemp: nextDays.map((day) => Math.round(Math.max(...day.temps)))
                    }
                }
            })
    
            const results = await Promise.all(weatherPromises)
            setWeatherData(results)
        } catch (error) {
            console.error('Error fetching weather data:', error)
        }
    }    

    const handleRefresh = () => {
        fetchWeatherAPI()
    }

    return (
        <div className="min-h-screen p-6 bg-base-100">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Previsão do Tempo - OpenWeather</h1>
                    <button
                        onClick={handleRefresh}
                        className="btn btn-neutral gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Atualizar
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {weatherData.map((city) => (
                        <div key={city.name} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="card-body">
                                <h2 className="card-title text-2xl">{city.name}</h2>

                                <div className="stats bg-base-300 shadow mt-4">
                                    <div className="stat">
                                        <div className="stat-title">Temperatura Atual</div>
                                        <div className="stat-value text-4xl">{city.current.temperature}°C</div>
                                        <div className="stat-desc">Chuva: {city.current.rain}mm</div>
                                    </div>
                                </div>

                                <div className="divider">Próximos dias</div>

                                <div className="space-y-4">
                                    {city.daily.dates.map((date, i) => (
                                        <div key={date.toISOString()}
                                            className="bg-base-300 p-4 rounded-lg hover:bg-base-content/10 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium capitalize">
                                                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="badge badge-outline gap-1">
                                                        <span className="font-medium">Min</span>
                                                        <span>{city.daily.minTemp[i]}°C</span>
                                                    </div>
                                                    <div className="badge badge-outline gap-1">
                                                        <span className="font-medium">Máx</span>
                                                        <span>{city.daily.maxTemp[i]}°C</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {weatherData.length > 0 && (
                    <div className="flex justify-center">
                        <button 
                            onClick={() => exportToExcel(weatherData)}
                            className="btn btn-secondary gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Exportar para Excel
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
