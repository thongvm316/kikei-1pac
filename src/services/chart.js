import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  chart: '/accounting_management/total'
})

export default {
  getData() {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.chart}`
    })
  }
}
