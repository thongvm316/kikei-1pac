import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  group: '/group'
})

export default {
  getGroup() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.group}` })
  }
}
