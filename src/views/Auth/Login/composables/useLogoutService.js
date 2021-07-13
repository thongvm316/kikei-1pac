import services from '@/services'
const AuthService = services.get('AuthService')
const StorageService = services.get('StorageService')
import storageKeys from '@/enums/storage-keys'

export default function useLogoutService(loading) {
  const logout = async () => {
    loading.value = true
    try {
      await AuthService.logout()

      StorageService.remove(storageKeys.authProfile)
    } finally {
      loading.value = false
    }
  }

  return {
    logout
  }
}
