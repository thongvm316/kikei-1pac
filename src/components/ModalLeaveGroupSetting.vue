<template>
  <a-modal v-model:visible="open" :title="$t('modal.leave_group')" class="modal-group-setting" @cancel="handleCancel">
    <template #footer>
      <div class="box">
        <p>{{ $t('modal.group_setting_line1') }}</p>
        <p>{{ $t('modal.group_setting_line2') }}</p>
      </div>
      <a-button key="back" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button type="primary" @click="handleLeave">
        {{ $t('modal.leave') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'ModalLeaveGroupSetting',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:visible'],

  setup(props, context) {
    const { visible } = toRefs(props)
    const open = ref(props.visible)
    const { locale } = useI18n()
    const store = useStore()
    const router = useRouter()

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
      store.commit('company/STORE_COMPANY_INFOMATION_CHECKSIDEBAR', false)
      store.commit('company/STORE_COMPANY_INFOMATION_LEAVEGROUP', false)
    }

    watch(visible, (val) => {
      open.value = val
    })

    const handleLeave = () => {
      open.value = false
      context.emit('update:visible', false)
      router.push({ name: store.state.company.navName })
      store.commit('company/STORE_COMPANY_INFOMATION_CHECKSIDEBAR', false)
      store.commit('company/STORE_COMPANY_INFOMATION_LEAVEGROUP', true)
    }

    return {
      open,
      locale,
      handleCancel,
      handleLeave
    }
  }
})
</script>

<style scoped lang="scss">
.modal-group-setting {
  .box {
    margin-bottom: 21px;

    p {
      margin-bottom: 0;
    }
  }
}
</style>
