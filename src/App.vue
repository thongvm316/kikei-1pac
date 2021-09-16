<template>
  <router-view />
</template>

<script>
import { defineComponent, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { notification } from 'ant-design-vue'

const MESSAGE_VARIANTS = ['open', 'error', 'info', 'warning', 'warn', 'successfully']

export default defineComponent({
  name: 'App',

  setup() {
    const store = useStore()
    const { t } = useI18n()

    const flashMessage = computed(() => store.state.flash.message)
    const onClose = () => {
      store.commit('flash/CLEAR_FLASH_MESSAGE')
    }

    const showMessage = () => {
      const { variant, message, placement, duration } = flashMessage.value
      // check variant
      if (!MESSAGE_VARIANTS.includes(variant)) throw new Error('Should be input correct variant')
      if (message) notification.open({ message: t(message), placement, duration, class: variant, onClose })
    }

    showMessage()
    watch(flashMessage, showMessage)

    return {
      flashMessage,
      t
    }
  }
})
</script>
