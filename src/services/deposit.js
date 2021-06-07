import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  deposit: '/deposit'
})

export default {
  createDeposit(data, params) {
    return apiCaller({ method: 'POST', url: RESOURCES.deposit, params, data })
  },

  getDeposit(data, params) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.deposit}/search`, params, data })
  },

  // TODO: waiting BE
  // getDepositDetail(id) {
  //   return apiCaller({ method: 'POST', url: `${RESOURCES.deposit}/`,  })
  // },

  deleteDeposit(depositId) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.deposit}/${depositId}` })
  }
}
