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
    header: [
      t('project.updated_date'),
      'Project Code',
      t('project.project_name'),
      'Company Name',
      t('project.type'),
      t('project.status'),
      t('project.accuracy_name'),
      t('project.release_date'),
      t('project.money'),
      t('project.statistics_from_month'),
      t('project.group_name'),
      t('project.account_name')
    ],
    fileTitle: 'project',
    labels: [
      { field: 'updatedAt', formatBy: 'moment_l' },
      'code',
      'name',
      'companyName',
      'typeName',
      'statusName',
      'accuracyName',
      { field: 'releaseDate', formatBy: 'moment_l' },
      'money',
      { field: 'statisticsFromMonth', formatBy: 'moment_l' },
      'groupName',
      'accountName'
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
    throw e
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
