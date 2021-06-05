import services from '@/services'
const DepositService = services.get('DepositService')
const GroupService = services.get('GroupService')
const BankAccountsService = services.get('BankAccountsService')

export const getDeposit = async (data, params) => {
  try {
    const res = await DepositService.getDeposit(data, params)

    return res
  } catch (e) {
    throw e
  }
}

export const getGroupList = async () => {
  try {
    const { data } = await GroupService.getGroupList()

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
