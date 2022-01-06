import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  orderCost: '/project/order-cost'
})

export default {
  getList(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.orderCost}/list`, params })
  },

  create(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.orderCost}`, data })
  },

  update(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.orderCost}/update`, data })
  },

  delete(data) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.orderCost}/delete`, data })
  },

  upsert(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.orderCost}/upsert`, data })
  }
}
