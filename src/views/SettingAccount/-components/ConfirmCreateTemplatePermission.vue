<template>
  <a-modal class="modal-save-template" v-model:visible="visible" centered title="テンプレート保存" width="388px">
    <template #footer>
      <a-input
        v-model:value="templateName"
      />
      <p class="modal-save-template__description">※テンプレート名を入力してください</p>
      <a-button type="default" @click="handleCancel">キャンセル</a-button>
      <a-button type="primary" :disabled="!templateName" @click="handleOk">削除</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ConfirmCreateTemplatePermission',

  props: {

  },

  setup(props, { emit }) {
    const visible = ref()
    const templateName = ref('')

    const handleCancel = () => {
      emit('update:visible', false)
    }

    const handleOk = () => {
      emit('handleSaveTemplate', templateName.value)
    }

    return {
      visible,
      templateName,
      handleCancel,
      handleOk
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.modal-save-template {
  &__description {
    font-size: 12px;
    line-height: 18px;
    color: $color-grey-75;
    text-align: left;
  }

  .ant-modal-footer {
    padding: 24px 16px;
  }
}
</style>
