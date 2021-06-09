import services from '@/services'
const AuthService = services.get('AuthService')
const StorageService = services.get('StorageService')
import storageKeys from '@/enums/storage-keys'

export default function useLoginService(params, loading) {
  const login = async () => {
    loading.value = true
    try {
      const response = await AuthService.login(params)
      const { token } = response.data.result.data || null
      if (!token) return

      // store auth profile
      StorageService.set(storageKeys.authProfile, response.data.result.data)
    } finally {
      loading.value = false
    }
  }

  return {
    login
  }
}
