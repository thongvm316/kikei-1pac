import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  log: '/log'
})

export default {
  getLists(params = {}, data) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.log}/search`,
      params,
      data
    })
  },

  logDetail(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.log}/${id}` })
  }
}
