import services from '@/services'
const AuthService = services.get('AuthService')
const StorageService = services.get('StorageService')
import storageKeys from '@/enums/storage-keys'

export default function useUpdateNewEmailService(params) {
  const updateNewEmail = async () => {
    try {
      const response = await AuthService.updateNewEmail(params)
      const { token } = response.data.result.data || null
      if (!token) return

      // store auth profile
      StorageService.set(storageKeys.authProfile, response.data.result.data)
    } catch (e) {
      console.log(e)
    }
  }

  return {
    updateNewEmail
  }
}
