import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  account: '/account'
})

export default {
  getAccounts(params = {}, data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}/search`, params, data })
  },

  accountDetail(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.account}/${id}` })
  },

  createAccount(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}`, data })
  },

  updateAccount(id, data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.account}/${id}`, data })
  },

  deleteAccount(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.account}/${id}` })
  }
}
