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

export const getBankAccounts = async (params) => {
  try {
    const { data } = await BankAccountsService.getBankAccounts(params)

    return data
  } catch (e) {
    throw e
  }
}

export const getCategory = async (params) => {
  try {
    const { data } = await CategoryService.getCategory(params)

    return data
  } catch (error) {
    throw error
  }
}

export const getSubCategory = async (params) => {
  try {
    const { data } = await SubCategoryService.getSubCategory(params)

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

export const createDeposit = async (data) => {
  try {
    await DepositService.createDeposit(data)
  } catch (error) {
    throw error
  }
}

export const getDepositDetail = async (id) => {
  try {
    const { data } = await DepositService.getDepositDetail(id)

    return data
  } catch (error) {
    throw error
  }
}