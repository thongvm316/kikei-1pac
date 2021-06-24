import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useCreateSubcategoryService(data) {
  const createSubcategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.createSubcategory(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createSubcategory }
}
