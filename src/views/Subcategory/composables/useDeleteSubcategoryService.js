import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useDeleteSubCategoryService(id, params) {
  const deleteSubCategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.deleteSubCategory(id, params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { deleteSubCategory }
}
