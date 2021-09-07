import services from '@/services'
const ProfileService = services.get('ProfileService')

export default function usePutProfileService(data) {
  const putProfile = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.putProfile(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    putProfile
  }
}
