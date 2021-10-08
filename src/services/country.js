import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  country: '/country'
})

export default {
  getCountry() {
    return apiCaller({ method: 'GET', url: `${RESOURCES.country}` })
  }
}
