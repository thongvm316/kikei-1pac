<template>
  <a-modal
    :visible="visible"
    width="85%"
    class="modal-modify-deposit modal-modify-deposit-js"
    :title="isEditDepositMode ? '入出金編集' : '入出金削除'"
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
        {{ `入出金が "${isEditDepositMode ? totalChildDeposit : totalDeleteDeposit}" ある` }}
      </p>

      <DepositTable
        v-if="optionValue === 2"
        v-model:data-deposit="dataTableDeposit"
        v-model:is-loading-data-table="isLoadingDataTable"
        v-model:current-selected-row-keys="currentSelectedRowKeysMutation"
        v-model:isDeleteRootAll="isDeleteRootAll"
        :is-table-modal="true"
        :type-modify-deposit-root="typeModifyDepositRoot"
        :current-selected-record-id="currentSelectedRecord.id"
        @on-sort="onSortTable"
      />

      <div class="u-mt-24 u-mb-16">
        <a-button type="default" @click="handleCancel">{{ $t('deposit.confirm_modal.cancel_btn') }}</a-button>
        <a-button v-if="isEditDepositMode" type="primary" @click="handleEdit">編集</a-button>
        <a-button v-else type="danger" :disabled="isDisableDelete" @click="handleDelete"> 削除 </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, onBeforeMount, computed, nextTick } from 'vue'
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
    const currentSelectedRowKeysMutation = ref([])
    const isDeleteRootAll = ref(true)

    // pagination
    const pageNumber = ref(1)
    const totalPages = ref(0)
    const totalChildDeposit = ref(0)

    const isEditDepositMode = computed(() => props.typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT['EDIT'])
    const exceptionDeposit = computed(() =>
      dataTableDeposit.value.filter((item) => !currentSelectedRowKeysMutation.value.includes(item.id))
    )
    const totalDeleteDeposit = computed(() => totalChildDeposit.value - exceptionDeposit.value.length)
    const isDisableDelete = computed(() => {
      if (optionValue.value === EDIT_OPTIONS.value[0].value) return false

      if (isDeleteRootAll.value) {
        return exceptionDeposit.value.length === dataTableDeposit.value.length
      } else {
        return currentSelectedRowKeysMutation.value.length === 0
      }
    })

    const EDIT_OPTIONS = computed(() => [
      {
        id: 1,
        label: 'この入出金',
        value: 1
      },
      {
        id: 2,
        label: props.typeModifyDepositRoot === TYPE_MODIFY_DEPOSIT_ROOT.EDIT ? '全ての入出金' : '選択した入出金',
        value: 2
      }
    ])

    const handleCancel = () => {
      emit('update:currentSelectedRowKeys', [])
      emit('update:visible', false)
      emit('update:currentSelectedRecord', null)
    }

    const handleDelete = () => {
      const emitData = {
        idRoot: props.currentSelectedRecord?.rootDepositId,
        optionDelete: optionValue.value,
        currentSelectedRowKeys: currentSelectedRowKeysMutation.value,
        exceptIdList: exceptionDeposit.value.map((item) => item.id),
        isDeleteRootAll: isDeleteRootAll.value
      }

      emit('on-delete-deposit-root', emitData)
    }

    const handleEdit = () => {
      const isEditRoot = optionValue.value === EDIT_OPTIONS.value[1].value

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
        rootDepositId,
        confirmed: [false]
      }
      const paramsRequest = { pageNumber: pageNumber.value, pageSize: 50, ...params }

      try {
        const { data = {} } = await getDeposit(dataRequest, paramsRequest)
        const newDataDeposit = createDataTableFormat(data.result?.data || [], null)

        // add data table
        if (pageNumber.value === 1) {
          dataTableDeposit.value = newDataDeposit
        } else {
          dataTableDeposit.value = [...dataTableDeposit.value, ...newDataDeposit]
          currentSelectedRowKeysMutation.value = [
            ...currentSelectedRowKeysMutation.value,
            ...newDataDeposit.map((item) => item.id)
          ]
        }

        // update paginations
        totalPages.value = data?.result?.meta?.totalPages || 0
        totalChildDeposit.value = data?.result?.meta?.totalRecords || 0
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
      optionValue.value = EDIT_OPTIONS.value[0].value
      fetchDatatableDeposit()
    })

    const onChangeOption = (event) => {
      if (event.target.value === EDIT_OPTIONS.value[1].value) {
        currentSelectedRowKeysMutation.value = dataTableDeposit.value.map((item) => item.id)
        nextTick(() => {
          const tableContent = document.querySelector('.modal-modify-deposit-js .ant-table-body')
          if (!tableContent) return

          tableContent.addEventListener('scroll', () => {
            const per = (tableContent.scrollTop / (tableContent.scrollHeight - tableContent.clientHeight)) * 100
            if (per >= 100 && !isLoadingDataTable.value) {
              pageNumber.value = pageNumber.value + 1
              if (pageNumber.value <= totalPages.value) fetchDatatableDeposit()
            }
          })
        })
      }
    }

    return {
      EDIT_OPTIONS,
      optionValue,
      isLoadingDataTable,
      dataTableDeposit,
      totalChildDeposit,
      totalDeleteDeposit,
      TYPE_MODIFY_DEPOSIT_ROOT,
      currentSelectedRowKeysMutation,
      isEditDepositMode,
      isDeleteRootAll,
      isDisableDelete,

      handleCancel,
      handleEdit,
      handleDelete,
      onSortTable,
      onChangeOption
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
