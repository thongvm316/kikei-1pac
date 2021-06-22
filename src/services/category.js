import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  category: '/category'
})

export default {
  getCategory(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.category}`, params })
  },

  getLists(params = {}, data) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.category}/search`,
      params,
      data
    })
  },

  categoryDetail(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.category}/${id}` })
  },

  createCategory(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.category}`, data })
  },

  updateCategory(id, data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.category}/${id}`, data })
  },

  deleteCategory(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.category}/${id}` })
  }
}
