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

  deleteCompany(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.company}/${id}` })
  }
}
