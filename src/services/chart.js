import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  chart: '/financing/search/chart'
})

export default {
  getDataChart(data, params) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.chart}`,
      data,
      params
    })
  }
}
