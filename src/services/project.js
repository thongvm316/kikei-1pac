import apiCaller from './api-caller'

const RESOURCES = Object.freeze({
  project: '/project'
})

export default {
  getProjectList(params = null, data = {}) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.project}/search`,
      params,
      data
    })
  },

  addProject(data) {
    return apiCaller({ method: 'POST', url: RESOURCES.project, data })
  },

  editProject(projectId, data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.project}/${projectId}`, data })
  },

  getProject(projectId, params) {
    return apiCaller({ url: `${RESOURCES.project}/${projectId}`, params })
  },

  deleteProject(projectId) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.project}/${projectId}` })
  },

  getProjectStatuses() {
    return apiCaller({ url: `${RESOURCES.project}/status` })
  },

  getProjectAccuracies() {
    return apiCaller({ url: `${RESOURCES.project}/accuracy` })
  },

  getRecordRead(projectId) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.project}/read/${projectId}` })
  },

  getLaborDirectCostList(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.project}/labor-direct-cost/list`, params })
  },

  createLaborDirectCostList(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.project}/labor-direct-cost`, data })
  },

  upsertLaborDirectCostList(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.project}/labor-direct-cost/upsert`, data })
  },

  deleteLaborDirectCostList(data) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.project}/labor-direct-cost/delete`, data })
  },

  createRevenue(data) {
    return apiCaller({ method: 'POST', url: `${RESOURCES.project}/revenue`, data })
  },

  getRevenueList(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.project}/revenue/list`, params })
  },

  upsertRevenueProject(data) {
    return apiCaller({ method: 'PUT', url: `${RESOURCES.project}/revenue/update`, data })
  },

  getRevenueProject(params) {
    return apiCaller({ method: 'GET', url: `${RESOURCES.project}/revenue/list-detail`, params })
  },

  deleteRevenueItem(data) {
    return apiCaller({ method: 'DELETE', url: `${RESOURCES.project}/revenue-item/delete`, data })
  }
}
