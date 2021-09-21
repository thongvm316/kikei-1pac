<template>
  <a-modal
    :visible="visible"
    width="85%"
    class="modal-modify-deposit modal-modify-deposit-js"
    :title="typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['EDIT'] ? '入出金編集' : '入出金削除'"
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
        v-model:current-selected-row-keys="currentSelectedRowKeysMutation"
        :is-table-modal="true"
        :type-modify-deposit-root="typeModifyDepositRoot"
        :current-selected-record-id="currentSelectedRecord.id"
        @on-sort="onSortTable"
      />

      <div class="u-mt-24 u-mb-16">
        <a-button type="default" @click="handleCancel">{{ $t('deposit.confirm_modal.cancel_btn') }}</a-button>
        <a-button v-if="typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['EDIT']" type="primary" @click="handleEdit"
          >編集</a-button
        >
        <a-button
          v-if="typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['DELETE']"
          type="danger"
          @click="handleDelete"
        >
          削除
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import DepositTable from '@/views/Deposit/-components/DepositTable'
import { getDeposit, createDataTableFormat } from '@/views/Deposit/composables/useDeposit'
import { TYPE_MODIFY_DEPOSIT_ROOT } from '@/enums/deposit.enum'

export default defineComponent({
  name: 'ModifyDepositModal',

  components: {
    DepositTable
  },

  props: {
    visible: Boolean,
    groupId: Number,
    currentSelectedRecord: Object,
    typeModifyDepositRoot: String,
    currentSelectedRowKeys: Array
  },

  setup(props, { emit }) {
    const optionValue = ref(1)
    const router = useRouter()

    // table params
    const isLoadingDataTable = ref(false)
    const dataTableDeposit = ref([])
    const totalChildDeposit = ref(0)
    const currentSelectedRowKeysMutation = ref()

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
      emit('update:currentSelectedRowKeys', [])
      emit('update:visible', false)
    }

    const handleDelete = () => {
      const emitData = {
        optionDelete: optionValue.value,
        currentSelectedRowKeys: currentSelectedRowKeysMutation.value
      }
      emit('on-delete-deposit-roots', emitData)
    }

    const handleEdit = () => {
      const isEditRoot = optionValue.value === EDIT_OPTIONS[1].value

      router.push({
        name: 'deposit-edit',
        params: {
          isEditDeposit: true,
          id: props.currentSelectedRecord.id,
          rootDepositId: isEditRoot ? props.currentSelectedRecord.rootDepositId : null,
          isEditRoot
        }
      })
    }

    const fetchDatatableDeposit = async (params) => {
      const rootDepositId = props.currentSelectedRecord?.rootDepositId || null
      if (!rootDepositId) return

      isLoadingDataTable.value = true

      const dataRequest = {
        groupId: props.groupId,
        rootDepositId
      }
      const paramsRequest = { pageNumber: 1, pageSize: 50, ...params }

      try {
        const { data = {} } = await getDeposit(dataRequest, paramsRequest)

        dataTableDeposit.value = createDataTableFormat(data.result?.data || [], null)
        totalChildDeposit.value = data.result?.meta.totalRecords || 0
      } catch (err) {
        dataTableDeposit.value = []
      } finally {
        isLoadingDataTable.value = false
      }
    }

    const onSortTable = (emitData) => {
      const currentSortStr = emitData.orderBy ? `${emitData.field} ${emitData.orderBy}` : ''
      fetchDatatableDeposit({ orderBy: currentSortStr })
    }

    onBeforeMount(() => {
      optionValue.value = EDIT_OPTIONS[0].value
      fetchDatatableDeposit()
    })

    watch(
      () => optionValue.value,
      () => (currentSelectedRowKeysMutation.value = props.currentSelectedRowKeys)
    )

    return {
      EDIT_OPTIONS,
      optionValue,
      isLoadingDataTable,
      dataTableDeposit,
      totalChildDeposit,
      TYPE_MODIFY_DEPOSIT_ROOT,
      currentSelectedRowKeysMutation,
      handleCancel,
      onChangeOption,
      handleEdit,
      handleDelete,
      onSortTable
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.modal-modify-deposit {
  .ant-modal-content {
    max-width: 1305px;
    margin: 0 auto;
    width: 100%;
  }

  .ant-modal-footer {
    padding-left: 24px;
    padding-right: 24px;
  }

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
