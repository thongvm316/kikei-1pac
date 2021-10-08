import services from '@/services'
const CountryService = services.get('CountryService')

export default function useGetCountryListService() {
  const getCountry = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await CountryService.getCountry()
      return response.data
    } catch (e) {
      throw e
    }
  }

  return {
    getCountry
  }
}
