import apiCaller from '@/services/api-caller'

const RESOURCES = Object.freeze({
  financing: '/financing'
})

export default {
  getLists(data, params) {
    return apiCaller({
      method: 'POST',
      url: `${RESOURCES.financing}/search`,
      data,
      params
    })
  }
}
