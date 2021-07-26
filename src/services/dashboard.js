import apiCaller from './api-caller'

// const RESOURCES = Object.freeze({
// })

export default {
  getPendingDeposits() {
    return apiCaller({ method: 'GET', url: '/group/pendingdeposits' })
  }
}
