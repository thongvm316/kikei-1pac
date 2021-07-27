import services from '@/services'
const ChartService = services.get('ChartService')

export default function useGetDetailChartService(data, params) {
  const getDetailChart = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ChartService.getDetailChart(data, params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getDetailChart
  }
}
