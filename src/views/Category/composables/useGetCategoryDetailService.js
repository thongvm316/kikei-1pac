import services from '@/services'
const CategoryService = services.get('CategoryService')

export default function useGetCategoryDetailService(id) {
  const categoryDetail = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CategoryService.categoryDetail(id)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    categoryDetail
  }
}
