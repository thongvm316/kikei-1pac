import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  subCategory: '/subcategory'
})

export default {
  getSubCategory(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.subCategory}`, params })
  }
}
