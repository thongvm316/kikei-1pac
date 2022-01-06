import services from '@/services'
const ProfileService = services.get('ProfileService')

export default function useSuggestNewEmailService(data) {
  const suggestNewEmail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.suggestNewEmail(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    suggestNewEmail
  }
}
