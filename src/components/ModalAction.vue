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
    <a-button v-show="isShowResetPassword" class="btn-reset" @click="$emit('reset', $event)">
      <template #icon><ReloadOutlined /></template>
      {{ t('action.reset_password') }}
    </a-button>
    <a-button type="link" class="btn-close" @click="$emit('close', $event)">
      <template #icon>
        <span class="btn-icon">
          <close-icon />
        </span>
      </template>
    </a-button>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { FormOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons-vue'

import { useI18n } from 'vue-i18n'
import CloseIcon from '@/assets/icons/ico_close.svg'

export default defineComponent({
  name: 'ModalAction',

  components: { FormOutlined, DeleteOutlined, ReloadOutlined, CloseIcon },

  props: {
    isShowResetPassword: {
      type: Boolean,
      default: false
    }
  },

  emits: ['edit', 'delete', 'reset', 'close'],

  setup() {
    const { t } = useI18n()

    return { t }
  }
})
</script>
