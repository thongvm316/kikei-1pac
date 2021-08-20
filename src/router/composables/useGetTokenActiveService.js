import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenActiveService(params) {
  const getTokenActive = async () => {
    try {
      const response = await AuthService.getTokenActive(params)
      return response.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    getTokenActive
  }
}
