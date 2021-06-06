import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  group: '/group'
})

export default {
  getGroupList() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.group}` })
  }
}
