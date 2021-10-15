import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  balance_registration: '/balance_registration'
})

export default {
  getListBalanceRegistration(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.balance_registration}/search`, data })
  },

  createOrUpdateRegistration(id,data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.balance_registration}/${id}`, data })
  },
}
