import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenActiveService(params) {
  const getTokenActive = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AuthService.getTokenActive(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getTokenActive
  }
}
