<template>
  <div>
    <a-modal v-model:visible="isVisible" title="Detail" @cancel="handleCancel">
      <template #footer>
        {{ dataLog }}
        <a-button key="back" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { ref, defineComponent, toRefs, watch } from 'vue'

export default defineComponent({
  name: 'ModalActivityLogs',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    datalog: {
      type: Object,
      require: false
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const { datalog } = toRefs(props)
    const isVisible = ref(props.visible)
    const dataLog = ref(props.datalog)
    const modalText = ref('Content of the modal')
    const confirmLoading = ref(false)

    watch(visible, (val) => {
      isVisible.value = val
    })

    watch(datalog, (val) => {
      dataLog.value = val
    })

    const showModal = () => {
      isVisible.value = true
    }

    const handleCancel = () => {
      isVisible.value = false
      context.emit('update:visible', false)
    }

    return {
      modalText,
      confirmLoading,
      isVisible,
      dataLog,
      showModal,
      handleCancel
    }
  }
})
</script>

<style scoped></style>
