import apiCaller from '@/services/api-caller'

const RESOURCES = Object.freeze({
  currency: '/currency'
})

export default {
  getCurrency() {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.currency}/search`
    })
  },

  getCurrencyCompanyInfomation() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.currency}` })
  }
}
