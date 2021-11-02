<template>
  <a-modal
    v-model:visible="visible"
    class="recover-deposit-modal recover-deposit-modal-js"
    width="85%"
    title="ごみ箱"
    @cancel="handleCancel"
  >
    <template #footer>
      <p class="recover-deposit-count">入出金が "{{ totalPages }}" 削除しました</p>

      <deposit-table
        v-model:data-deposit="dataTableDeposit"
        v-model:is-loading-data-table="isLoadingDataTable"
        v-model:current-selected-row-keys="currentSelectedRowKeys"
        :is-table-modal="true"
        :is-recover-modal="true"
        @on-sort="onSortTable"
      />

      <div class="u-mt-24 u-mb-16">
        <a-button type="default" @click="handleCancel">キャンセル</a-button>
        <a-button
          :loading="isLoadedOkButton"
          :disabled="currentSelectedRowKeys.length < 1"
          type="primary"
          @click="handleOk"
          >戻す</a-button
        >
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, nextTick, onBeforeMount, ref } from 'vue'
import DepositTable from '@/views/Deposit/-components/DepositTable'
import { getDeposit, createDataTableFormat } from '@/views/Deposit/composables/useDeposit'
import services from '@/services'
const DepositService = services.get('DepositService')

export default defineComponent({
  name: 'RecoverDepositModal',

  components: {
    DepositTable
  },

  props: {
    groupId: {
      type: Number,
      required: true
    }
  },

  emits: ['update:visible', 'restore-deposit'],

  setup(props, { emit }) {
    const visible = ref()
    const isLoadingDataTable = ref()
    const pageNumber = ref(1)
    const dataTableDeposit = ref([])
    const currentSelectedRowKeys = ref([])
    const totalPages = ref(0)
    const isLoadedOkButton = ref()
    const currentSortStr = ref('ad_deposit.deleted_at desc')

    const handleCancel = () => {
      emit('update:visible', false)
    }

    const handleOk = async () => {
      isLoadedOkButton.value = true
      try {
        await DepositService.recoverDeposit({ id: currentSelectedRowKeys.value })
        emit('on-restore-deposit', currentSelectedRowKeys.value.length)
      } finally {
        isLoadedOkButton.value = false
        emit('update:visible', false)
      }
    }

    const fetchDatatableDeposit = async (params) => {
      isLoadingDataTable.value = true

      const dataRequest = {
        groupId: props.groupId,
        isDeleted: true
      }
      const paramsRequest = { orderBy: currentSortStr.value, pageNumber: pageNumber.value, pageSize: 50, ...params }

      try {
        const { data = {} } = await getDeposit(dataRequest, paramsRequest)
        const newDataDeposit = createDataTableFormat(data.result?.data || [], null) || []

        dataTableDeposit.value = [...dataTableDeposit.value, ...newDataDeposit]

        // update paginations
        totalPages.value = data?.result?.meta?.totalPages || 0
      } catch (err) {
        dataTableDeposit.value = []
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const onSortTable = (emitData) => {
      dataTableDeposit.value = []
      pageNumber.value = 1
      currentSortStr.value = emitData.orderBy ? `${emitData.field} ${emitData.orderBy}` : ''
      fetchDatatableDeposit({ orderBy: currentSortStr.value })
    }

    onBeforeMount(() => {
      fetchDatatableDeposit()

      nextTick(() => {
        const tableContent = document.querySelector('.recover-deposit-modal-js .ant-table-body')
        if (!tableContent) return

        tableContent.addEventListener('scroll', () => {
          const per = (tableContent.scrollTop / (tableContent.scrollHeight - tableContent.clientHeight)) * 100
          if (per >= 98 && !isLoadingDataTable.value) {
            pageNumber.value++
            if (pageNumber.value <= totalPages.value) fetchDatatableDeposit()
          }
        })
      })
    })

    return {
      visible,
      isLoadingDataTable,
      dataTableDeposit,
      currentSelectedRowKeys,
      isLoadedOkButton,
      totalPages,
      handleCancel,
      handleOk,
      onSortTable
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.recover-deposit-modal {
  .recover-deposit-count {
    margin: 16px 0 6px;
    text-align: left;
    color: $color-grey-55;
    line-height: 22px;
  }
}
</style>
