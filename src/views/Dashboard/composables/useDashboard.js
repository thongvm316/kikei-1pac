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

export const getPendingDeposits = async (isLoading, params) => {
  isLoading.value = true
  try {
    const { data = {} } = await DashboardService.getPendingDeposits(params)

    return data
  } catch (e) {
    throw e
  } finally {
    isLoading.value = false
  }
}

export const getRevenueStatistics = async (isLoading, params) => {
  isLoading.value = true
  try {
    const { data = {} } = await DashboardService.getRevenueStatistics(params)

    return data
  } catch (e) {
    throw e
  } finally {
    isLoading.value = false
  }
}

export const getRevenueBalance = async (isLoading, params) => {
  isLoading.value = true
  try {
    const { data = {} } = await DashboardService.getRevenueBalance(params)

    return data
  } catch (e) {
    throw e
  } finally {
    isLoading.value = false
  }
}

export const getRevenue = async (params) => {
  try {
    const { data } = await DashboardService.getRevenue(params)

    return data
  } catch (e) {
    throw e
  }
}

export const getBankAccountBalance = async (params) => {
  try {
    const { data } = await DashboardService.getBankAccountBalance(params)

    return data
  } catch (e) {
    throw e
  }
}
