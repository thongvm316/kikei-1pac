import apiCaller from '@/services/api-caller'

const RESOURCES = Object.freeze({
  financing: '/financing',
  groups: '/groups',
  period: '/period'
})

export default {
  getLists(params = {}, data) {
    return apiCaller({
      headers:{'Content-Type': 'application/json'},
      method: 'POST',
      url: `${RESOURCES.financing}/search?page_number=${params.pageNumber}&page_size=${params.pageSize}`,
      data
    })
  },

  getListGroups(data) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.groups}`, data })
  },

  getListPeriod(id) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.period}/dropdown?group_id=${id}`, id })
  }
}
