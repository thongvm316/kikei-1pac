import services from '@/services'
const ProjectService = services.get('ProjectService')

export default function useSuggestSearch(params) {
  const getSuggestSearch = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await ProjectService.getSuggestSearch(params)

      return data
    } catch (e) {
      throw e
    }
  }

  const getSuggestTag = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await ProjectService.getSuggestTag(params)

      return data
    } catch (e) {
      throw e
    }
  }

  return { getSuggestSearch, getSuggestTag }
}
