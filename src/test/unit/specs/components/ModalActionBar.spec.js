import { shallowMount } from '@vue/test-utils'
import ModalActionBar from '@/components/ModalActionBar'

describe('ModalActionBar', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ModalActionBar, {
      props: {
        enableGoToDeposit: false
      },

      global: {
        stubs: { AButton: true }
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  describe('when ModalActionBar.vue mounted', () => {
    it('should render correctly', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render goToDeposit button', async () => {
      await wrapper.setProps({ enableGoToDeposit: true })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('when click button', () => {
    it('should emit on-go-to-edit', async () => {
      await wrapper.find('[data-test="goToEditButton"]').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('on-go-to-edit')
      expect(wrapper.emitted()['on-go-to-edit']).toHaveLength(1)
    })

    it('should emit on-go-to-copy', async () => {
      await wrapper.find('[data-test="goToCopyButton"]').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('on-go-to-copy')
      expect(wrapper.emitted()['on-go-to-copy']).toHaveLength(1)
    })

    it('shout emit on-go-to-deposit', async () => {
      await wrapper.setProps({ enableGoToDeposit: true })
      await wrapper.find('[data-test="goToDepositButton"]').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('on-go-to-deposit')
    })

    it('shout emit on-go-to-delete', async () => {
      await wrapper.find('[data-test="goToDeleteButton"]').trigger('click')

      expect(wrapper.emitted()).toHaveProperty('on-go-to-delete')
      expect(wrapper.emitted()['on-go-to-delete']).toHaveLength(1)
    })
  })
})
