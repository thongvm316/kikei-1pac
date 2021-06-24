import services from '@/services'
const SubCategoryService = services.get('SubCategoryService')

export default function useCreateSubCategoryService(data) {
  const createSubCategory = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await SubCategoryService.createSubCategory(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return { createSubCategory }
}
