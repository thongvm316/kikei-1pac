import service from '@/services'
import i18n from '@/locale'
import { addUniqueRowKey } from '@/helpers/table'
import { exportCSVFile } from '@/helpers/export-csv-file'

const ProjectService = service.get('ProjectService')
const { t } = i18n.global

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

export const exportProject = (items) => {
  const exportObj = {
    fileTitle: 'project',
    labels: [
      { header: t('project.updated_date'), field: 'updatedAt', formatBy: 'moment_l' },
      { header: 'Project Code', field: 'code' },
      { header: t('project.project_name'), field: 'name' },
      { header: 'Company Name', field: 'companyName' },
      { header: t('project.type'), field: 'typeName' },
      { header: t('project.accuracy_name'), field: 'accuracyName' },
      { header: t('project.release_date'), field: 'releaseDate', formatBy: 'moment_l' },
      { header: t('project.money'), field: 'money' },
      { header: t('project.statistics_from_month'), field: 'statisticsFromMonth', formatBy: 'moment_l' },
      { header: t('project.group_name'), field: 'groupName' },
      { header: t('project.account_name'), field: 'accountName' }
    ],
    items
  }

  exportCSVFile(exportObj)
}

export const getProject = async (projectId) => {
  try {
    const { data: response } = await ProjectService.getProject(projectId)
    return response?.result?.data || {}
  } catch(e) {
    throw e
  }
}

export const addProject = async (data) => {
  try {
    const response = await ProjectService.addProject(data)
    return response
  } catch (e) {
    return e.response
  }
}

export const editProject = async (projectId, data) => {
  try {
    const response = await ProjectService.editProject(projectId, data)
    return response
  } catch (e) {
    return e.response
  }
}

export const deleteProject = async (projectId) => {
  try {
    const response = await ProjectService.deleteProject(projectId)
    return response
  } catch (e) {
    throw e
  }
}

export const getProjectStatuses = async () => {
  try {
    const { data } = await ProjectService.getProjectStatuses()
    return data.result || []
  } catch (e) {
    throw e
  }
}

export const getProjectAccuracies = async () => {
  try {
    const { data } = await ProjectService.getProjectAccuracies()
    return data.result || []
  } catch (e) {
    throw e
  }
}
