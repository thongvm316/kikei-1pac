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
  }
}
