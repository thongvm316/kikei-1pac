import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  template: '/template'
})

export default {
  getPermissionTemplate() {
    return apiCaller({ method: 'GET', url: RESOURCES.template })
  }
}
