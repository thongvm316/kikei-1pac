import services from '@/services'
const ChartService = services.get('ChartService')

export default function useGetDataChartService(data, params) {
  const getDataChart = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ChartService.getDataChart(data, params)
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getDataChart
  }
}
