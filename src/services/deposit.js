import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  deposit: '/deposit'
})

export default {
  getDeposit(data, params) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.deposit}/search`, params, data })
  },

  deleteDeposit(depositId) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.deposit}/${depositId}` })
  }
}
