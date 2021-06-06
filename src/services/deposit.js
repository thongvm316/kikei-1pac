import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  create: '/deposit'
})

export default {
  getDeposit(data, params) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.deposit}/search`, params, data })
  }
}
