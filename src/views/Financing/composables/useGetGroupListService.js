import services from '@/services'
const GroupService = services.get('GroupService')

export default function useGetGroupListService() {
  const getGroups = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await GroupService.getGroups()
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getGroups
  }
}
