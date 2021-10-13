import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  deposit: '/deposit'
})

export default {
  createDeposit(data) {
    return apiCaller({ method: 'POST', url: RESOURCES.deposit, data })
  },

  updateDeposit(depositId, data, params) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.deposit}/${depositId}`, params, data })
  },

  getDeposit(data, params) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.deposit}/search`, params, data })
  },

  getDepositDetail(depositId, params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.deposit}/${depositId}`, params })
  },

  deleteDeposit(data) {
    return apiCaller({ method: 'DELETE', url: RESOURCES.deposit, data })
  },

  deleteDepositRoot(id, data) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.deposit}/root/${id}`, data })
  },

  confirmDeposit(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.deposit}/confirm`, data })
  },

  unconfirmDeposit(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.deposit}/unconfirm`, data })
  },

  getRecordRead(projectId) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.deposit}/read/${projectId}` })
  },

  recoverDeposit(data) {
    return apiCaller({ method: 'PATCH', url: `${RESOURCES.deposit}/restore`, data })
  }
}
