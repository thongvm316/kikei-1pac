import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useGetSubcategoryDetailService(id) {
  const subcategoryDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.subcategoryDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    subcategoryDetail
  }
}
