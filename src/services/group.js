import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  group: '/group'
})

export default {
  getGroups(params = {}) {
    return apiCaller({ method: 'GET', url: RESOURCES.group, params })
  },

  getGroupsForAccount(featureKey, params = {}) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.group}/group_for_account/${featureKey}`, params })
  },

  getGroupsFinancing(params = {}) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.group}/group_for_account/3`, params })
  }
}
