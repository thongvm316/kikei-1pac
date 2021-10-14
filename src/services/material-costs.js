import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  materialCost: '/project/material-cost'
})

export default {
  getList(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.materialCost}/list`, params })
  },

  create(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.materialCost}`, data })
  },

  update(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.materialCost}/update`, data })
  },

  delete(data) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.materialCost}/delete`, data })
  },

  upsert(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.materialCost}/upsert`, data })
  }
}
