import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  login: '/login',
  logout: '/logout',
  setpassword: '/setpassword',
  updatenewemail: '/update-new-email',
  updatenewpassword: '/update-new-password',
  checkactivatetoken: '/check-activate-token'
})

export default {
  login(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.login}`, data, needAuth: 0 })
  },

  logout() {
    return apiCaller({ method: 'POST', url: `${RESOURCES.logout}` })
  },

  getToken(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.setpassword}`, data, needAuth: 0 })
  },

  getTokenActive(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.checkactivatetoken}`, data, needAuth: 0 })
  },

  getTokenActiveEmail(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.checkactivatetoken}-set-email`, data, needAuth: 0 })
  },

  updateNewEmail(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.updatenewemail}`, data, needAuth: 0 })
  },

  getNewPassword(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.updatenewpassword}`, data, needAuth: 0 })
  },

  getTokenActivePassword(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.checkactivatetoken}-change-password`, data, needAuth: 0 })
  }
}
