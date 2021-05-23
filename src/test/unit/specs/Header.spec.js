import { mount } from '@vue/test-utils'

import Header from '@/layouts/-components/AppHeader'
import router from '@/router'
import i18n from '@/locale'

describe('Header', () => {
  it('should display header text', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(Header, {
      global: {
        plugins: [router, i18n]
      }
    })

    expect(wrapper.html()).toContain('header')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
