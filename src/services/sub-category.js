import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  subCategory: '/subcategory'
})

export default {
  getLists(params = {}, data) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.subCategory}/search`,
      params,
      data
    })
  },

  getSubCategory(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.subCategory}`, params })
  },

  subCategoryDetail(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.subCategory}/${id}` })
  },

  createSubCategory(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.subCategory}`, data })
  },

  updateSubCategory(id, data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.subCategory}/${id}`, data })
  },

  deleteSubCategory(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.subCategory}/${id}` })
  }
}
