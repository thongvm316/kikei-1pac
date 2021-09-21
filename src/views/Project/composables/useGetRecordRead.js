import services from '@/services'
const ProjectService = services.get('ProjectService')

export default function useGetRecordRead(projectId) {
  const getRecordRead = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ProjectService.getRecordRead(projectId)

      return response.data
    } catch (e) {
      throw e
    }
  }

  return { getRecordRead }
}
