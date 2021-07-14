import services from '@/services'
const BankAccountsService = services.get('BankAccountsService')

export default function useGetBankAccountsService(params) {
  const getBankAccounts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await BankAccountsService.getBankAccounts(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getBankAccounts
  }
}
