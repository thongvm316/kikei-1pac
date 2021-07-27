/* eslint-disable no-useless-catch */
import services from '@/services'

const GroupService = services.get('GroupService')
const DashboardService = services.get('DashboardService')

export const getGroups = async () => {
  try {
    const { data = {} } = await GroupService.getGroups()

    return data
  } catch (e) {
    throw e
  }
}

export const getPendingDeposits = async (isLoadingAccountingOperations) => {
  isLoadingAccountingOperations.value = true
  try {
    const { data = {} } = await DashboardService.getPendingDeposits()

    return data
  } catch (e) {
    throw e
  } finally {
    isLoadingAccountingOperations.value = false
  }
}

export const getRevenue = async (param) => {
  try {
    const { data } = await DashboardService.getRevenue(param)

    return data
  } catch (e) {
    throw e
  }
}
