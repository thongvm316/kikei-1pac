import services from '@/services'
const ProfileService = services.get('ProfileService')

export default function useGetProfileDetailService(id) {
  const profileDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProfileService.profileDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    profileDetail
  }
}
