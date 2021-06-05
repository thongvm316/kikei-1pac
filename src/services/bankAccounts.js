import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  bankAccounts: '/bank-accounts'
})

export default {
  getBankAccounts() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.bankAccounts}` })
  }
}
