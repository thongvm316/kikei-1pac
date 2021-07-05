import services from '@/services'

const UserService = services.get('UserService')

export default function useChangePassAccountService(data) {
  const changePassAccount = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await UserService.changePassAccount(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    changePassAccount
  }
}
