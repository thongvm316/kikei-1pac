import services from '@/services'

const SettingAccountService = services.get('SettingAccountService')

export default function useGetAccountDetailService(params, data) {
  const getAccounts = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SettingAccountService.getAccounts(params, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getAccounts
  }
}
