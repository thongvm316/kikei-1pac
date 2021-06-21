import services from '@/services'
const CategoryService = services.get('CategoryService')

export default function useUpdateCategoryService(id, data) {
  const updateCategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CategoryService.updateCategory(id, data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { updateCategory }
}
