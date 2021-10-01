/* eslint-disable no-useless-catch */
import services from '@/services'
import { TYPE_NAME_DEPOSIT } from '@/enums/deposit.enum'

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

export const confirmDeposit = async (data) => {
  try {
    await DepositService.confirmDeposit(data)
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

export const deleteDeposit = async (dataRequest) => {
  try {
    const { data } = await DepositService.deleteDeposit(dataRequest)

    return data
  } catch (error) {
    throw error
  }
}

export const createDeposit = async (data) => {
  try {
    const response = await DepositService.createDeposit(data)
    return response
  } catch (error) {
    throw error
  }
}

export const getDepositDetail = async (id, params) => {
  try {
    const { data } = await DepositService.getDepositDetail(id, params)

    return data
  } catch (error) {
    throw error
  }
}

const handleDepositMoneyValue = (data) => {
  const { bankAccountId, depositBankAccountId, type, depositMoney, withdrawalMoney } = data

  if (bankAccountId) {
    return bankAccountId === depositBankAccountId ? depositMoney : `-${withdrawalMoney}`
  } else {
    let money

    switch (TYPE_NAME_DEPOSIT[type]) {
      case TYPE_NAME_DEPOSIT[10]:
        money = depositMoney
        break
      case TYPE_NAME_DEPOSIT[20]:
        money = `-${withdrawalMoney}`
        break
      case TYPE_NAME_DEPOSIT[30]:
        money = 0
        break
      case TYPE_NAME_DEPOSIT[40]:
        money = depositMoney > 0 ? depositMoney : `-${withdrawalMoney}`
        break
    }

    return money
  }
}

const handleColorDeposit = (bankAccountId, depositBankAccountId) => {
  if (!bankAccountId) return ''

  return bankAccountId === depositBankAccountId ? 'blue' : 'red'
}

const handleTypeNameDeposit = (type, bankAccountId, depositBankAccountId) => {
  if (bankAccountId) {
    return bankAccountId === depositBankAccountId ? TYPE_NAME_DEPOSIT[10] : TYPE_NAME_DEPOSIT[20]
  } else {
    return TYPE_NAME_DEPOSIT[type]
  }
}

export const createDataTableFormat = (data, bankAccountId) => {
  if (!data.length) return []

  return data.map((item) => {
    return Object.assign(item, {
      key: item.id,
      deposit: handleDepositMoneyValue({
        bankAccountId,
        type: item.type,
        depositMoney: item.depositMoney,
        withdrawalMoney: item.withdrawalMoney,
        depositBankAccountId: item.depositBankAccountId
      }),
      typeName: handleTypeNameDeposit(item.type, bankAccountId, item.depositBankAccountId),
      colorClass: handleColorDeposit(bankAccountId, item.depositBankAccountId)
    })
  })
}

export const updateDeposit = async (depositId, data, params) => {
  try {
    const response = await DepositService.updateDeposit(depositId, data, params)
    return response
  } catch (error) {
    throw error
  }
}

export const unconfirmDeposit = async (depositId) => {
  try {
    const response = await DepositService.unconfirmDeposit({ id: [depositId] })
    return response
  } catch (error) {
    throw error
  }
}

export const deleteDepositRoot = async (id, dataRequest) => {
  try {
    const { data } = await DepositService.deleteDepositRoot(id, dataRequest)

    return data
  } catch (error) {
    throw error
  }
}
