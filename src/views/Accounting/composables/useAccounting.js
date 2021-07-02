/* eslint-disable no-useless-catch */
import services from '@/services'

const GroupService = services.get('GroupService')
const PeriodService = services.get('PeriodService')
const AccountingManagementService = services.get('AccountingManagementService')

export const getGroups = async () => {
  try {
    const { data = {} } = await GroupService.getGroups()

    return data
  } catch (e) {
    throw e
  }
}

export const getPeriods = async (id) => {
  try {
    const { data = {} } = await PeriodService.getPeriods(id)

    return data
  } catch (e) {
    throw e
  }
}

export const getDeposit = async (dataRequest) => {
  try {
    const { data = {} } = await AccountingManagementService.getDeposit(dataRequest)

    return data
  } catch (e) {
    throw e
  }
}

export const getWithdrawal = async (dataRequest) => {
  try {
    const { data = {} } = await AccountingManagementService.getWithdrawal(dataRequest)

    return data
  } catch (e) {
    throw e
  }
}

export const getFinancingTotal = async (dataRequest) => {
  try {
    const { data = {} } = await AccountingManagementService.getFinancingTotal(dataRequest)

    return data
  } catch (e) {
    throw e
  }
}
