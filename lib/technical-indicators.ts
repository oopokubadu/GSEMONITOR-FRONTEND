import { ChartData } from "@/hooks/use-chart-data"

interface IndicatorData {
  time: string
  value: number
}

  export const calculateMA = (data: IndicatorData[], period = 14) => {
    return data.map((item, idx, arr) => {
      if (idx < period - 1) return null
      const slice = arr.slice(idx - period + 1, idx + 1)
      const avg = slice.reduce((sum, d) => sum + d.value, 0) / period
      return { time: item.time, value: avg }
    }).filter(Boolean)
  }

  export const calculateEMA = (data: IndicatorData[], period = 14) => {
    let ema: IndicatorData[] = []
    let k = 2 / (period + 1)
    data.forEach((item, idx) => {
      if (idx === 0) {
        ema.push({ time: item.time, value: item.value })
      } else {
        const prev = ema[ema.length - 1].value
        ema.push({ time: item.time, value: item.value * k + prev * (1 - k) })
      }
    })
    return ema.slice(period - 1)
  }

  export const calculateBB = (data: IndicatorData[], period = 20, mult = 2) => {
    let bands = []
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1)
      const avg = slice.reduce((sum, d) => sum + d.value, 0) / period
      const std = Math.sqrt(slice.reduce((sum, d) => sum + Math.pow(d.value - avg, 2), 0) / period)
      bands.push({
        time: data[i].time,
        upper: avg + mult * std,
        middle: avg,
        lower: avg - mult * std,
      })
    }
    return bands
  }

  // For RSI, MACD, Stochastic, you may want to use a library or implement the math
  export const calculateRSI = (data: IndicatorData[], period = 14) => {
    let rsi = []
    let gains = 0, losses = 0
    for (let i = 1; i < data.length; i++) {
      const change = data[i].value - data[i - 1].value
      if (i < period) {
        if (change > 0) gains += change
        else losses -= change
        continue
      }
      if (i === period) {
        const avgGain = gains / period
        const avgLoss = losses / period
        const rs = avgGain / (avgLoss || 1)
        rsi.push({ time: data[i].time, value: 100 - 100 / (1 + rs) })
      } else {
        const prev = rsi[rsi.length - 1].value
        const gain = change > 0 ? change : 0
        const loss = change < 0 ? -change : 0
        gains = (gains * (period - 1) + gain) / period
        losses = (losses * (period - 1) + loss) / period
        const rs = gains / (losses || 1)
        rsi.push({ time: data[i].time, value: 100 - 100 / (1 + rs) })
      }
    }
    return rsi
  }

  // MACD and Stochastic Oscillator are more complex; you may want to use a TA library for production
  export const calculateMACD = (data: IndicatorData[], fast = 12, slow = 26, signal = 9) => {
    const emaFast = calculateEMA(data, fast)
    const emaSlow = calculateEMA(data, slow)
    const macd = emaFast.map((d, i) => ({
      time: d.time,
      value: d.value - (emaSlow[i]?.value || 0),
    }))
    const signalLine = calculateEMA(macd, signal)
    return { macd, signal: signalLine }
  }

  export const calculateStoch = (data: any, kPeriod = 14, dPeriod = 3) => {
    let stoch = []
    for (let i = kPeriod - 1; i < data.length; i++) {
      const slice = data.slice(i - kPeriod + 1, i + 1)
      const high = Math.max(...slice.map((d: any) => d.high))
      const low = Math.min(...slice.map((d: any) => d.low))
      const k = ((data[i].close - low) / (high - low)) * 100
      if (isNaN(k) || !isFinite(k)) continue; // Skip NaN or infinite values
      stoch.push({ time: data[i].time, value: k })
    }
    // D line is SMA of K
    let d = []
    for (let i = dPeriod - 1; i < stoch.length; i++) {
      const slice = stoch.slice(i - dPeriod + 1, i + 1)
      const avg = slice.reduce((sum, d) => sum + d.value, 0) / dPeriod
      d.push({ time: stoch[i].time, value: avg })
    }
    console.log("stoch", stoch)
    return { k: stoch, d }
  }