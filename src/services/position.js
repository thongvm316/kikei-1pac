import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  position: '/position'
})

export default {
  getPositionList() {
    return apiCaller({ method: 'GET', url: RESOURCES.position })
  }
}
