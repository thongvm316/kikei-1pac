<template>
  <div class="box-btn">
    <a-button class="btn-edit" @click="$emit('edit', $event)">
      <template #icon><FormOutlined /></template>
      {{ t('action.edit') }}
    </a-button>
    <a-button class="btn-delete" @click="$emit('delete', $event)">
      <template #icon><DeleteOutlined /></template>
      {{ t('action.delete') }}
    </a-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'ModalAction',

  components: { FormOutlined, DeleteOutlined },

  emits: ['edit', 'delete'],

  setup() {
    const { t } = useI18n()

    return { t }
  }
})
</script>

<style scoped></style>
