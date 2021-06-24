import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useUpdateSubcategoryService(id, data) {
  const updateSubcategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.updateSubcategory(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { updateSubcategory }
}
