import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenActiveEmailService(params) {
  const getTokenActiveEmail = async () => {
    try {
      const response = await AuthService.getTokenActiveEmail(params)
      return response.data
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  return {
    getTokenActiveEmail
  }
}
