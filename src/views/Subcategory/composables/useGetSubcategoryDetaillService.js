import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useGetSubCategoryDetailService(id) {
  const subCategoryDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.subCategoryDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    subCategoryDetail
  }
}
