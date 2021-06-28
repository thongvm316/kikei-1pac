import service from '@/services'
const AccountService = service.get('AccountService')

export const useAccountList = async (dataReq) => {
  try {
    const { data } = await AccountService.getAccounts(dataReq)
    return data.result.data || []
  } catch (e) {
    throw e
  }
}
