import service from '@/services'
const AccountService = service.get('AccountService')

export const useAccountList = async () => {
  try {
    const { data } = await AccountService.getAccounts()
    return data.result.data || []
  } catch(e) {
    throw e
  }
}
