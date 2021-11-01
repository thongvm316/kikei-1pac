<template>
  <a-modal
    v-model:visible="visible"
    class="remind-statistic-month"
    centered
    title="確定"
    width="485px"
    :closable="false"
    @cancel="handleCancel"
  >
    <template #footer>
      <p>見積もりを編集・作成するには計上予定月を入力してください。</p>
      <a-button type="primary" @click="$emit('update:visible', false)">了解</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'RemindInputStatisticMonthModal',

  emits: ['update:visible'],

  setup(_, { emit }) {
    const visible = ref()

    const handleCancel = () => {
      emit('update:visible', false)
    }

    return {
      visible,
      handleCancel
    }
  }
})
</script>

<style lang="scss">
.remind-statistic-month {
  .ant-modal-header {
    display: none;
  }

  .ant-modal-footer p {
    padding-top: 6px;
  }
}
</style>
