import services from '@/services'
const AuthService = services.get('AuthService')

export default function useGetTokenActiveEmailService(params) {
  const getTokenActiveEmail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await AuthService.getTokenActiveEmail(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getTokenActiveEmail
  }
}
