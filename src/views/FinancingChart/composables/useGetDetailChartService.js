import services from '@/services'
const ChartService = services.get('ChartService')

export default function useGetDetailChartService(data) {
  const getDetailChart = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ChartService.getDetailChart(data)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getDetailChart
  }
}
