import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  category: '/category'
})

export default {
  getCategory(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.category}`, params })
  }
}
