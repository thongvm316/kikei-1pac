import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  group: '/group'
})

export default {
  getGroups() {
    return apiCaller({ method: 'GET', url: RESOURCES.group })
  }
}
