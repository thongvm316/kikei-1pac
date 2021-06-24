import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useDeleteSubcategoryService(id, params) {
  const deleteSubcategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.deleteSubcategory(id, params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { deleteSubcategory }
}
