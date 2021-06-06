import service from '@/services'
import { addUniqueRowKey } from '@/helpers/table'
const ProjectService = service.get('ProjectService')

export const getProjectList = async (pagination, loading, data) => {
  loading.value = true
  try {
    const { data: response } = await ProjectService.getProjectList(pagination, data)
    let projectList = []
    let pageData = {}
    if (response.result) {
      const { data, meta } = response.result
      projectList = addUniqueRowKey(data)
      pageData = meta
    }

    return {
      projectList,
      pageData
    }
  } finally {
    loading.value = false
  }
}

// TODO: waiting for API
// export const getProject = async () => {
//   try {
//     const response = await ProjectService.addProject(data)
//     return response
//   } catch(e) {
//     throw e
//   }
// }

export const addProject = async (data) => {
  try {
    const response = await ProjectService.addProject(data)
    return response
  } catch(e) {
    throw e
  }
}

export const getProjectStatuses = async () => {
  try {
    const { data } = await ProjectService.getProjectStatuses()
    return data.result || []
  } catch(e) {
    throw e
  }
}

export const getProjectAccuracies = async () => {
  try {
    const { data } = await ProjectService.getProjectAccuracies()
    return data.result || []
  } catch(e) {
    throw e
  }
}
