<template>
  <a-modal
    :visible="visible"
    width="85%"
    max-height="1024px"
    class="modal-modify-deposit"
    :title="'入出金編集'"
    @cancel="handleCancel"
  >
    <template #footer>
      <div class="modal-modify-deposit__options">
        <a-radio-group v-model:value="optionValue" class="options-groups" @change="onChangeOption">
          <a-radio v-for="item in EDIT_OPTIONS" :key="item.id" :value="item.value">
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </div>

      <p v-if="optionValue === 2" class="modal-modify-deposit__deposit-count">
        {{ `入出金が "${totalChildDeposit}" ある` }}
      </p>

      <DepositTable
        v-if="optionValue === 2"
        v-model:data-deposit="dataTableDeposit"
        v-model:is-loading-data-table="isLoadingDataTable"
        v-model:current-selected-row-keys="currentSelectedRowKeys"
        :is-table-modal="true"
      />

      <div class="u-mt-24 u-mb-16">
        <a-button type="default" @click="handleCancel">{{ $t('deposit.confirm_modal.cancel_btn') }}</a-button>
        <a-button type="primary" @click="$emit('on-confirm-deposit-record')"> Edit </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

import DepositTable from '@/views/Deposit/-components/DepositTable'

import { getDeposit, deleteDeposit, createDataTableFormat } from '@/views/Deposit/composables/useDeposit'

export default defineComponent({
  name: 'ModifyDepositModal',

  components: {
    DepositTable
  },

  props: {
    visible: Boolean
  },

  setup(props, { emit }) {
    const optionValue = ref(1)

    // table params
    const isLoadingDataTable = ref(false)
    const dataTableDeposit = ref([])
    const currentSelectedRowKeys = ref([])
    const totalChildDeposit = ref(0)

    const EDIT_OPTIONS = [
      {
        id: 1,
        label: 'この入出金',
        value: 1
      },
      {
        id: 2,
        label: '全ての入出金',
        value: 2
      }
    ]

    const onChangeOption = () => {}

    const handleCancel = () => {
      console.log('close modify modal')
      emit('update:visible', false)
    }

    const fetchDatatableDeposit = async () => {
      isLoadingDataTable.value = true

      const dataRequest = {
        group_id: 1
      }

      const paramsRequest = { pageNumber: 1, pageSize: 50 }

      try {
        const { data = {} } = await getDeposit(dataRequest, paramsRequest)

        dataTableDeposit.value = createDataTableFormat(data.result?.data || [], null)
        // isDisabledSelectAllRows.value = dataTableDeposit.value.filter((item) => !item.confirmed).length === 0
        totalChildDeposit.value = data.result?.meta.totalRecords || 0
        // currentPage.value = paramsRequest.pageNumber || 1
      } catch (err) {
        dataTableDeposit.value = []
      } finally {
        isLoadingDataTable.value = false
      }
    }

    watch(
      () => props.visible,
      () => {
        if (!props.visible) return
        fetchDatatableDeposit()
      }
    )

    return {
      EDIT_OPTIONS,
      optionValue,
      isLoadingDataTable,
      dataTableDeposit,
      currentSelectedRowKeys,
      totalChildDeposit,

      handleCancel,
      onChangeOption
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.modal-modify-deposit {
  &__options {
    @include flexbox(center, center);

    .options-groups {
      @include flexbox(center, flex-start);
      flex-direction: column;
      padding: 16px 0;

      .ant-radio-wrapper + .ant-radio-wrapper {
        margin-top: 8px;
      }
    }
  }

  &__deposit-count {
    text-align: left;
    margin-bottom: 6px;
  }
}
</style>
