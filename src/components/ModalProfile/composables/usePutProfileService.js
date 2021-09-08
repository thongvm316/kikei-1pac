import services from '@/services'
const ProfileService = services.get('ProfileService')

export default function usePutProfileService(data, loading) {
  const putProfile = async () => {
    loading.value = true
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.putProfile(data)
      return response.data
    } finally {
      loading.value = false
    }
  }

  return {
    putProfile
  }
}
