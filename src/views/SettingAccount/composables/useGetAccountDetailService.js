import services from '@/services'

const SettingAccountService = services.get('SettingAccountService')

export default function useGetAccountDetailService(id) {
  const accountDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SettingAccountService.accountDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    accountDetail
  }
}
