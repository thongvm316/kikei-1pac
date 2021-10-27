/* eslint-disable no-useless-catch */
import service from '@/services'
import i18n from '@/locale'
import { addUniqueRowKey } from '@/helpers/table'
import { exportCSVFile } from '@/helpers/export-csv-file'

const ProjectService = service.get('ProjectService')
const PositionService = service.get('PositionService')
const { t } = i18n.global

export const getProjectList = async (params, loading, data) => {
  loading.value = true
  try {
    const { data: response } = await ProjectService.getProjectList(params, data)
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
      { header: t('project.project_code'), field: 'code' },
      { header: t('project.project_name'), field: 'name' },
      { header: t('project.company_name'), field: 'companyName' },
      { header: t('project.type'), field: 'type', localeBy: 'project.type_' },
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

export const getProject = async (projectId, param) => {
  try {
    const { data: response } = await ProjectService.getProject(projectId, param)
    return response?.result?.data || {}
  } catch (e) {
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

export const getLaborDirectCostList = async (params) => {
  try {
    const { data } = await ProjectService.getLaborDirectCostList(params)

    return data.result || []
  } catch (e) {
    throw e
  }
}

export const createLaborDirectCostList = async (data) => {
  try {
    await ProjectService.createLaborDirectCostList(data)
  } catch (error) {
    throw error
  }
}

export const getPositionList = async () => {
  try {
    const { data } = await PositionService.getPositionList()

    return data
  } catch (error) {
    throw error
  }
}

export const upsertLaborDirectCostList = async (data) => {
  try {
    await ProjectService.upsertLaborDirectCostList(data)
  } catch (error) {
    throw error
  }
}

export const deleteLaborDirectCostList = async (data) => {
  try {
    await ProjectService.deleteLaborDirectCostList(data)
  } catch (error) {
    throw error
  }
}

export const createRevenue = async (dataReq) => {
  try {
    const { data } = await ProjectService.createRevenue(dataReq)

    return data
  } catch (error) {
    throw error
  }
}

export const getRevenueList = async (params) => {
  try {
    const { data } = await ProjectService.getRevenueList(params)

    return data
  } catch (error) {
    throw error
  }
}

export const upsertRevenueProject = async (data) => {
  try {
    await ProjectService.upsertRevenueProject(data)
  } catch (error) {
    throw error
  }
}

export const getRevenueProject = async (params) => {
  try {
    const { data } = await ProjectService.getRevenueProject(params)

    return data
  } catch (error) {
    throw error
  }
}

export const deleteRevenueItem = async (data) => {
  try {
    await ProjectService.deleteRevenueItem(data)
  } catch (error) {
    throw error
  }
}
