import services from '@/services'
const AuthService = services.get('AuthService')

export default function useUpdateNewEmailService(params) {
  const updateNewEmail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AuthService.updateNewEmail(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    updateNewEmail
  }
}
