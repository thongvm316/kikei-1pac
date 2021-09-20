<template>
  <a-modal
    :visible="visible"
    width="85%"
    class="modal-modify-deposit modal-modify-deposit-js"
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
        :type-modify-deposit-root="typeModifyDepositRoot"
      />

      <div class="u-mt-24 u-mb-16">
        <a-button type="default" @click="handleCancel">{{ $t('deposit.confirm_modal.cancel_btn') }}</a-button>
        <a-button v-if="typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['EDIT']" type="primary" @click="handleEdit"
          >Edit</a-button
        >
        <a-button
          v-if="typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['DELETE']"
          type="primary"
          @click="handleDelete"
        >
          Delete
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from 'vue'
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
    typeModifyDepositRoot: String
  },

  setup(props, { emit }) {
    const optionValue = ref(1)
    const router = useRouter()

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
      emit('update:visible', false)
    }

    const handleDelete = () => {
      const emitData = {
        optionDelete: optionValue.value,
        currentSelectedRowKeys: currentSelectedRowKeys.value
      }
      emit('on-delete-deposit-roots', emitData)
    }

    const handleEdit = () => {
      const isEditRoot = optionValue.value === EDIT_OPTIONS[1].value

      if (isEditRoot) {
        // edit deposit root
        router.push({
          name: 'deposit-edit',
          params: { id: props.currentSelectedRecord.rootDepositId, isEditRoot }
        })
      } else {
        // edit deposit child
        router.push({
          name: 'deposit-edit',
          params: { id: props.currentSelectedRecord.id, isEditRoot }
        })
      }
    }

    const fetchDatatableDeposit = async () => {
      isLoadingDataTable.value = true

      const dataRequest = {
        groupId: props.groupId,
        rootDepositId: props.currentSelectedRecord.rootDepositId || null
      }
      const paramsRequest = { pageNumber: 1, pageSize: 50 }

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

    onBeforeMount(() => {
      optionValue.value = EDIT_OPTIONS[0].value
      fetchDatatableDeposit()
    })

    return {
      EDIT_OPTIONS,
      optionValue,
      isLoadingDataTable,
      dataTableDeposit,
      currentSelectedRowKeys,
      totalChildDeposit,
      TYPE_MODIFY_DEPOSIT_ROOT,

      handleCancel,
      onChangeOption,
      handleEdit,
      handleDelete
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
