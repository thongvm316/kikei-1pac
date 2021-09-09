import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenActivePasswordService(params) {
  const getTokenActivePassword = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AuthService.getTokenActivePassword(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getTokenActivePassword
  }
}
