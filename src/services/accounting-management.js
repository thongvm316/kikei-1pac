import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  account: '/accounting_management'
})

export default {
  getDeposit(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}/deposit`, data })
  },

  getWithdrawal(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}/withdrawal`, data })
  },

  getTotal(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}/total`, data })
  }
}
