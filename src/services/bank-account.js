import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  bankAccount: '/bank-accounts'
})

export default {
  getBankAccount() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.bankAccount}` })
  }
}
