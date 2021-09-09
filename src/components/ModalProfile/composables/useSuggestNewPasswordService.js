import services from '@/services'
const ProfileService = services.get('ProfileService')

export default function useSuggestNewPasswordService() {
  const suggestNewPassword = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.suggestNewPassword()
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    suggestNewPassword
  }
}
