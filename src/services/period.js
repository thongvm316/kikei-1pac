import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  period: '/period'
})

export default {
  getPeriods(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.period}/dropdown?group_id=${id}` })
  }
}
