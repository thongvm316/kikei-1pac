import services from '@/services'
const StorageService = services.get('StorageService')
import storageKeys from '@/enums/storage-keys'

export default function useLogoutService(loading) {
  const logout = async () => {
    loading.value = true
    StorageService.remove(storageKeys.authProfile)
  }

  return {
    logout
  }
}
