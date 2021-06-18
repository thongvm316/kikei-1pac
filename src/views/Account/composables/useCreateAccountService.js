import services from '@/services'
const AccountService = services.get('AccountService')

export default function useCreateAccountService(data) {
  const accountDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AccountService.accountDetail(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { accountDetail }
}
