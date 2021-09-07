import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  profile: '/profile'
})

export default {
  profileDetail() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.profile}` })
  },

  putProfile(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.profile}/update`, data })
  }
}
