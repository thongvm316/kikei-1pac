import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useUpdateSubCategoryService(id, data) {
  const updateSubCategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.updateSubCategory(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { updateSubCategory }
}
