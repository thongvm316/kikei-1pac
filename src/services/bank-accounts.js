import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  bankAccount: '/bank-accounts'
})

export default {
  getBankAccounts(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.bankAccount}`, params })
  }
}
