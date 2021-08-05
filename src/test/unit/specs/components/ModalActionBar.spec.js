import { shallowMount } from '@vue/test-utils'
import ModalActionBar from '@/components/ModalActionBar'

describe('ModalActionBar', () => {
  it('should render ModalActionBar.vue', () => {
    const wrapper = shallowMount(ModalActionBar, {
      props: {
        isDisableDelete: false
      },

      global: {
        stubs:{
          AButton: true
        },

        mocks: {
          $t: text => text
        }
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
