/* eslint-disable no-useless-catch */
import services from '@/services'
const GroupService = services.get('GroupService')
const BankAccountsService = services.get('BankAccountsService')

export const getGroups = async () => {
  try {
    const { data } = await GroupService.getGroups()

    return data
  } catch (e) {
    throw e
  }
}

export const getGroupsForAccount = async (featureKey, params) => {
  try {
    const { data } = await GroupService.getGroupsForAccount(featureKey, params)

    return data
  } catch (e) {
    throw e
  }
}

export const getBankAccounts = async (params) => {
  try {
    const { data } = await BankAccountsService.getBankAccounts(params)

    return data
  } catch (e) {
    throw e
  }
}
