import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  deposit: '/deposit'
})

export default {
  createDeposit(data) {
    return apiCaller({ method: 'POST', url: RESOURCES.deposit, data })
  },

  getDeposit(data, params) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.deposit}/search`, params, data })
  },

  getDepositDetail(depositId) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.deposit}/${depositId}` })
  },

  deleteDeposit(depositId) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.deposit}/${depositId}` })
  }
}
