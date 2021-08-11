import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  project: '/template'
})

export default {
  getPermissionTemplate() {
    return apiCaller({ method: 'GET', url: RESOURCES.project })
  }
}
