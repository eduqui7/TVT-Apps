import { ChartData, ChartOptions } from 'chart.js'

declare module 'chart.js' {
  interface ChartTypeRegistry {
    line: {
      data: ChartData<'line'>
      options: ChartOptions<'line'>
    }
    bar: {
      data: ChartData<'bar'>
      options: ChartOptions<'bar'>
    }
  }
}

export type ChartType = 'line' | 'bar'
