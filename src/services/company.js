import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  company: '/company'
})

export default {
  getLists(params = {}, data) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.company}/search`,
      params,
      data
    })
  },

  companyDetail(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.company}/${id}` })
  },

  createCompany(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.company}`, data })
  },

  updateCompany(id, data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.company}/${id}`, data })
  },

  deleteCompany(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.company}/${id}` })
  }
}
