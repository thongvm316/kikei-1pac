/* eslint-disable no-useless-catch */
import services from '@/services'
const DepositService = services.get('DepositService')
const GroupService = services.get('GroupService')
const BankAccountsService = services.get('BankAccountsService')
const CategoryService = services.get('CategoryService')
const SubCategoryService = services.get('SubCategoryService')

export const getDeposit = async (data, params) => {
  try {
    const res = await DepositService.getDeposit(data, params)

    return res
  } catch (e) {
    throw e
  }
}

export const getGroups = async () => {
  try {
    const { data } = await GroupService.getGroups()

    return data
  } catch (e) {
    throw e
  }
}

export const getBankAccounts = async () => {
  try {
    const { data } = await BankAccountsService.getBankAccounts()

    return data
  } catch (e) {
    throw e
  }
}

export const getCategory = async () => {
  try {
    const { data } = await CategoryService.getCategory()

    return data
  } catch (error) {
    throw error
  }
}

export const getSubCategory = async () => {
  try {
    const { data } = await SubCategoryService.getSubCategory()

    return data
  } catch (error) {
    throw error
  }
}

export const deleteDeposit = async (id) => {
  try {
    await DepositService.deleteDeposit(id)
  } catch (error) {
    throw error
  }
}

export const createDeposit = async (params, data) => {
  try {
    await DepositService.createDeposit(params, data)
  } catch (error) {
    throw error
  }
}

// TODO: waiting BE API
// export const getDepositDetail = async (id) => {
//   try {
//     await DepositService.getDepositDetail(id)
//   } catch (error) {
//     throw error
//   }
// }
