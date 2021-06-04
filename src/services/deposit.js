import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  create: '/deposit'
})

export default {
  create(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.create}`, data })
  }
}
