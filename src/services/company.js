import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  company: '/company'
})

export default {
  getLists(params = {}) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.company}`, params })
  },

  deleteCompany(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.company}/${id}` })
  }
}
