import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  directCost: '/project/direct-costs'
})

export default {
  getList(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.directCost}/list`, params })
  },

  create(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.directCost}`, data })
  },

  update(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.directCost}/update`, data })
  },

  delete(data) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.directCost}/delete`, data })
  },

  upsert(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.directCost}/upsert`, data })
  }
}
