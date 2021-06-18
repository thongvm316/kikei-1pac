import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  account: '/account'
})

export default {
  getAccounts() {
    return apiCaller({ method: 'POST', url: `${RESOURCES.account}/search`, data: {} })
  },

  accountDetail(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.account}/${id}` })
  }
}
