<template>
  <a-modal v-model:visible="open" :title="$t('modal.title')" class="modal-delete" @cancel="handleCancel">
    <template #footer>
      <template v-if="locale === 'en'">
        <p>{{ $t('modal.message_en') }} {{ data.name }}?</p>
      </template>
      <template v-if="locale === 'ja'">
        <p>{{ data.name + $t('modal.message_ja') }}</p>
      </template>
      <a-button key="back" class="btn-close" @click="handleCancel">{{ $t('modal.cancel') }}</a-button>
      <a-button type="danger" class="btn-delete" @click="handleDelete">
        {{ $t('modal.delete') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useDeleteCompanyInfomationService from '@/views/CompanyInformation/compasables/useDeleteCompanyInfomation'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ModalDeleteCompanyInfomation',

  props: {
    propsDataDelete: {
      type: Object,
      required: true
    }
  },

  emits: ['update:visible', 'delete'],

  setup(props, context) {
    const store = useStore()
    const { t, locale } = useI18n()

    const { propsDataDelete } = toRefs(props)

    const data = ref({})

    watch(propsDataDelete, (value) => {
      data.value = value
    })

    const handleCancel = () => {
      open.value = false
      context.emit('update:visible', false)
    }

    const handleDelete = async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const { deleteCompanyInfomation } = useDeleteCompanyInfomationService(data.value.id)
        await deleteCompanyInfomation()

        store.commit('flash/STORE_FLASH_MESSAGE', {
          variant: 'successfully',
          duration: 5,
          message:
            locale.value === 'en'
              ? t('company_infomation.delete_tab') + data.value.name
              : data.value.name + t('company_infomation.delete_tab')
        })
        open.value = false
        context.emit('update:visible', false)
        store.commit('company/STORE_COMPANY_INFOMATION_DELETED', true)
      } catch (err) {
        throw err
      }
    }

    return {
      locale,
      data,
      open,
      handleCancel,
      handleDelete
    }
  }
})
</script>
