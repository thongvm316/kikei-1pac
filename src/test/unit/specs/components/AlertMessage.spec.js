import { mount } from '@vue/test-utils'

import AlertMessage from '@/components/AlertMessage'

describe('AlertMessage', () => {
  it('should render AlertMessage.vue', () => {
    const wrapper = mount(AlertMessage)

    expect(wrapper.html()).toBe('<div>alert Message</div>')
  })
})
