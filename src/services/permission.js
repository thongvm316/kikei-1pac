import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  template: '/template'
})

export default {
  getPermissionTemplate() {
    return apiCaller({ method: 'GET', url: RESOURCES.template })
  },

  createPermissionTemplate(data) {
    return apiCaller({ method: 'POST', url: RESOURCES.template, data })
  },

  deletePermissionTemplate(id) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.template}/${id}` })
  }
}
