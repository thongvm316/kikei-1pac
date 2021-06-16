/* eslint-disable no-useless-catch */
import services from '@/services'
import { uniqueId } from 'lodash-es'
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
    const response = await DepositService.createDeposit(data)
    return response
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

const typeNameBank = (depositMoney, withdrawMoney) => {
  if (depositMoney > withdrawMoney) {
    return TYPE_NAME_DEPOSIT[10]
  } else if (depositMoney < withdrawMoney) {
    return TYPE_NAME_DEPOSIT[20]
  } else {
    return 'type_none'
  }
}

const depositBank = (depositMoney, withdrawMoney) => {
  if (depositMoney > withdrawMoney) {
    return depositMoney
  } else if (depositMoney < withdrawMoney) {
    return `-${withdrawMoney}`
  } else {
    return '-'
  }
}

const handleDepositMoneyValue = (type, depositMoney, withdrawMoney) => {
  let money
  switch (TYPE_NAME_DEPOSIT[type]) {
    case TYPE_NAME_DEPOSIT[10]:
      money = depositMoney
      break
    case TYPE_NAME_DEPOSIT[20]:
      money = `-${withdrawMoney}`
      break
    case TYPE_NAME_DEPOSIT[30]:
      money = 0
      break
    case TYPE_NAME_DEPOSIT[40]:
      money = depositMoney > 0 ? depositMoney : `-${withdrawMoney}`
      break
  }

  return money
}

const createExpandDataTable = (data, confirmed) => {
  if (!data || data.length <= 0) return []

  return data.map((bank) => ({
    ...bank,
    date: null,
    statisticsMonth: null,
    class: typeNameBank(bank.deposit, bank.withdrawal),
    key: uniqueId('expand-row'),
    purpose: `${bank.name} (${bank.currency})`,
    typeName: typeNameBank(bank.deposit, bank.withdrawal),
    deposit: depositBank(bank.deposit, bank.withdrawal),
    confirmed
  }))
}

export const createDataTableFormat = (data) => {
  if (!data.length) return []

  return data.map((item) => {
    return Object.assign(item, {
      key: item.id,
      children: createExpandDataTable(item.bankAccounts, item.id, item.purpose, item.confirmed),
      deposit: handleDepositMoneyValue(item.type, item.depositMoney, item.withdrawalMoney),
      typeName: TYPE_NAME_DEPOSIT[item.type]
    })
  })
}

export const updateDeposit = async (depositId, data) => {
  try {
    const response = await DepositService.updateDeposit(depositId, data)
    return response
  } catch (error) {
    throw error
  }
}
