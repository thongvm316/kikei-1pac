import services from '@/services'

const AccountService = services.get('AccountService')

export default function useGetAccountDetailService(params, data) {
  const getAccounts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AccountService.getAccounts(params, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getAccounts
  }
}
