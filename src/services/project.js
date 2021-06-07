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
