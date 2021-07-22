import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  chart: '/financing/search/chart'
})

export default {
  getDataChart(params) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.chart}`,
      params
    })
  }
}
