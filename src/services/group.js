import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  group: '/group/group_for_account/3'
})

export default {
  getGroups(params = {}) {
    return apiCaller({ method: 'GET', url: RESOURCES.group, params })
  }
}
