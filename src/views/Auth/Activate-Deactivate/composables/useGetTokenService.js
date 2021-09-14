import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenService(params) {
  const getToken = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AuthService.getToken(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getToken
  }
}
