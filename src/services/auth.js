import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  login: '/login',
  logout: '/logout'
})

export default {
  login(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.login}`, data, needAuth: 0 })
  },

  logout() {
    return apiCaller({ method: 'POST', url: `${RESOURCES.logout}` })
  }
}
