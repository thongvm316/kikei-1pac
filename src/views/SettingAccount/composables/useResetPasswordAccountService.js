import services from '@/services'

const SettingAccountService = services.get('SettingAccountService')

export default function useGetAccountDetailService(data) {
  const resetPasswordAccount = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SettingAccountService.resetPasswordAccount(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    resetPasswordAccount
  }
}
