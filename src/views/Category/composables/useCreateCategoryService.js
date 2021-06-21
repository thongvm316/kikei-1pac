import services from '@/services'
const CategoryService = services.get('CategoryService')

export default function useCreateCategoryService(data) {
  const createCategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CategoryService.createCategory(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createCategory }
}
