import services from '@/services'
const ChartService = services.get('ChartService')

export default function useGetDataChartService(params) {
  const getDataChart = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ChartService.getDataChart(params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getDataChart
  }
}
