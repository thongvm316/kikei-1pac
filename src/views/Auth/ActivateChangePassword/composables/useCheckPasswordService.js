import services from '@/services'
const AuthService = services.get('AuthService')

export default function useCheckPasswordService(params) {
  const getNewPassword = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AuthService.getNewPassword(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getNewPassword
  }
}
