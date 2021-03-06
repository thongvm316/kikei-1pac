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
  },

  checkPasswordEmail(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.profile}/check-password-and-email`, data })
  },

  suggestNewEmail(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.profile}/suggest-new-email`, data })
  },

  suggestNewPassword() {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.profile}/suggest-new-password` })
  }
}
