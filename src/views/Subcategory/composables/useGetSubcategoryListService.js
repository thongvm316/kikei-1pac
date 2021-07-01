import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useGetSubcategoryListService(params, data) {
  const getLists = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.getLists(params, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getLists
  }
}
