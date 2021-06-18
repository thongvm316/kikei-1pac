<template>
  <a-modal v-model:visible="isVisible" :title="$t('logs.title_show')" @cancel="handleCancel">
    <template #footer>
      <template v-if="Object.keys(logs).length">
        <a-textarea v-model:value="logs" :rows="20" />
      </template>
      <template v-else>
        <LoadingOutlined />
      </template>
      <a-button key="back" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { ref, defineComponent, toRefs, watch } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { pickBy, startsWith } from 'lodash-es'

export default defineComponent({
  name: 'ModalActivityLogs',

  components: { LoadingOutlined },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dataLog: {
      type: Object,
      default: () => {},
      require: false
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const { dataLog } = toRefs(props)

    const isVisible = ref(props.visible)
    const logs = ref(props.dataLog)
    const confirmLoading = ref(false)

    watch(visible, (val) => {
      isVisible.value = val
    })

    watch(dataLog, (val) => {
      const result = pickBy(val.result.data, function (value, key) {
        return startsWith(key, 'bodyOfRequest') || startsWith(key, 'bodyOfResponse')
      })
      logs.value = JSON.stringify(result, null, '\t')
    })

    const showModal = () => {
      isVisible.value = true
    }

    const handleCancel = () => {
      isVisible.value = false
      context.emit('update:visible', false)
    }

    return {
      confirmLoading,
      isVisible,
      logs,
      showModal,
      handleCancel
    }
  }
})
</script>

<style scoped lang="scss">
.anticon-loading {
  display: block;
  margin-bottom: 20px;
}

.ant-input {
  margin-bottom: 20px;
}

.ant-modal {
  width: 800px;
}
</style>
