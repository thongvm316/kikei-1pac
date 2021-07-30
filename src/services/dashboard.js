import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  revenue: '/revenue'
})

export default {
  getPendingDeposits() {
    return apiCaller({ method: 'GET', url: '/group/pendingdeposits' })
  },

  getRevenue(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.revenue}/topcompany`, params })
  },

  getRevenueStatistics(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.revenue}/statistics`, params })
  },

  getRevenueBalance(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.revenue}/balance`, params })
  },

  getBankAccountBalance(params) {
    return apiCaller({ method: 'GET', url: `/bankaccountbalance`, params })
  }
}
