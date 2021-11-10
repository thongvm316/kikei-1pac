import services from '@/services'
const ProjectService = services.get('ProjectService')

export default function useSuggestSearch(params) {
  const getSuggestSearch = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProjectService.getSuggestSearch(params)

      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getSuggestSearch }
}
