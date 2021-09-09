import services from '@/services'
const ProfileService = services.get('ProfileService')

export default function useCheckPasswordEmailService(data) {
  const checkPasswordEmail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.checkPasswordEmail(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    checkPasswordEmail
  }
}
