import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenActivePasswordService(params) {
  const getTokenActivePassword = async () => {
    try {
      const response = await AuthService.getTokenActivePassword(params)
      return response.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    getTokenActivePassword
  }
}
