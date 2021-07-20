import services from '@/services'
const ChartService = services.get('ChartService')

export default function useGetDataChartService() {
  const getData = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ChartService.getData()
      console.log(response)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getData
  }
}
