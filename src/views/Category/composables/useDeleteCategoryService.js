import services from '@/services'
const CategoryService = services.get('CategoryService')

export default function useDeleteCategoryService(id, params) {
  const deleteCategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CategoryService.deleteCategory(id, params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { deleteCategory }
}
