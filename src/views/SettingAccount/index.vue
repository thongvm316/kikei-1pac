<template>
  <section class="account-wrap">
    <account-search-form @filter-changed="onFilterChange($event)" />

    <div class="box-create">
      <a-button class="btn-modal" type="primary" @click="$router.push({ name: 'account-new' })">
        <add-icon class="add-icon" />
        {{ $t('account.add_account') }}
      </a-button>
    </div>

    <a-table
      id="list-table"
      v-click-outside="handleClickOutsideTable"
      :columns="columns"
      :data-source="dataSource"
      :row-key="(record) => record.id"
      :loading="isLoading"
      :pagination="{
        ...pagination,
        showTotal: showTotal
      }"
      :custom-row="customRow"
      :row-selection="rowSelection"
      :scroll="{ y: height - 211 }"
      size="middle"
      @change="handleChange"
    >
      <template #active="{ text: active }">
        {{ active === true ? $t('account.in_use') : $t('account.retired') }}
      </template>
    </a-table>

    <ModalAction
      v-if="recordVisible.visible"
      ref="modalActionRef"
      v-model:is-show-reset-password="isShowResetPass"
      @edit="handleEditRecord"
      @delete="openDelete = true"
      @reset="openReset = true"
      @close="onCloseModalAction"
    />

    <ModalDelete v-model:visible="openDelete" :name="recordVisible.name" @delete="handleDeleteRecord($event)" />
    <ModalReset v-model:visible="openReset" :name="recordVisible.name" @reset="handleResetPassword($event)" />
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { convertPagination } from '@/helpers/convert-pagination'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import useGetAccountListService from '@/views/SettingAccount/composables/useGetAccountListService'
import useDeleteAccountService from '@/views/SettingAccount/composables/useDeleteAccountService'
import useResetPasswordAccountService from '@/views/SettingAccount/composables/useResetPasswordAccountService'
import AccountSearchForm from '@/views/SettingAccount/-components/AccountSearchForm'

import Table from '@/mixins/table.mixin'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import ModalReset from '@/components/ModalReset'
import Services from '@/services'
import storageKeys from '@/enums/storage-keys'

const defaultParam = {
  type: []
}
const StorageService = Services.get('StorageService')

export default defineComponent({
  name: 'Index',

  components: { ModalAction, AccountSearchForm, AddIcon, ModalDelete, ModalReset },

  mixins: [Table],

  async beforeRouteEnter(to, from, next) {
    const { getAccounts } = useGetAccountListService({ pageNumber: 1, pageSize: 30 }, defaultParam)
    const { result } = await getAccounts()
    to.meta['lists'] = result.data
    to.meta['pagination'] = { ...convertPagination(result.meta) }
    next()
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, locale } = useI18n()
    const store = useStore()

    const openDelete = ref(false)
    const openReset = ref(false)
    const dataSource = ref([])
    const pagination = ref({})
    const filter = ref({})
    const isLoading = ref(false)
    const recordVisible = ref({})
    const modalActionRef = ref()
    const isShowResetPass = ref(false)
    const params = ref({})
    const height = ref(0)

    const state = reactive({ selectedRowKeys: [] })
    let tempRow = reactive([])

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: state.selectedRowKeys,
        columnWidth: 0,
        type: 'radio'
      }
    })

    const columns = computed(() => {
      return [
        {
          title: t('account.login_id'),
          dataIndex: 'username',
          key: 'username',
          sorter: true
        },
        {
          title: t('account.full_name'),
          dataIndex: 'fullname',
          key: 'fullname',
          sorter: true
        },
        {
          title: t('account.status'),
          dataIndex: 'active',
          key: 'active',
          slots: { customRender: 'active' }
        }
      ]
    })

    onMounted(async () => {
      dataSource.value = [...route.meta['lists']]
      pagination.value = { ...route.meta['pagination'] }
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)

      StorageService.get(storageKeys.authProfile).isAdmin
        ? (isShowResetPass.value = true)
        : (isShowResetPass.value = false)
    })

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    const handleChange = async (pagination, filters, sorter) => {
      if (sorter.order === 'ascend') {
        sorter.order = 'asc'
      } else if (sorter.order === 'descend') {
        sorter.order = 'desc'
      } else {
        sorter.order = ''
      }

      params.value = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        order_by: sorter.order === '' ? '' : sorter.field + ' ' + sorter.order
      }
      await fetchList(params.value, filter.value)
    }

    const onFilterChange = async (evt) => {
      filter.value = { ...deleteEmptyValue(evt) }

      Object.assign(filter.value, defaultParam)

      await fetchList(pagination.value, filter.value)
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteAccount } = useDeleteAccountService(recordVisible.value.id)
        await deleteAccount()
      } catch (error) {
        console.log(error)
      }
      openDelete.value = false
      recordVisible.value.visible = false
      await fetchList(pagination.value)
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message:
          locale.value === 'en'
            ? 'Deleted' + recordVisible.value.name
            : recordVisible.value.username + ' を削除しました'
      })
    }

    const handleEditRecord = () => {
      router.push({
        name: 'account-edit',
        params: {
          id: recordVisible.value.id
        }
      })
    }

    const handleResetPassword = async () => {
      try {
        const { resetPasswordAccount } = useResetPasswordAccountService(recordVisible.value.id)
        await resetPasswordAccount()
      } catch (error) {
        console.log(error)
      }
      openReset.value = false
      await fetchList(pagination.value)
      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message:
          locale.value === 'en'
            ? 'Password reset' + recordVisible.value.name + ' was successful'
            : recordVisible.value.username + ' のアカウントのパスワードのリセットが成功しました'
      })
    }

    const fetchList = async (params = {}, data) => {
      isLoading.value = true
      try {
        const { getAccounts } = useGetAccountListService({ ...params }, data)
        const { result } = await getAccounts()

        dataSource.value = [...result.data]
        pagination.value = convertPagination(result.meta)
        isLoading.value = false
      } catch (e) {
        isLoading.value = false
      }
    }

    const selectRow = (record) => {
      recordVisible.value = { ...record }

      if (tempRow.length && tempRow[0] === record.id) {
        state.selectedRowKeys = []
        tempRow = []
        recordVisible.value.visible = false
      } else {
        state.selectedRowKeys = [record.id]
        tempRow = [record.id]
        recordVisible.value.visible = true
      }
    }

    const customRow = (record) => {
      return {
        onClick: () => {
          selectRow(record)
        }
      }
    }

    // close action bar
    const handleClickOutsideTable = (event) => {
      const el = modalActionRef.value?.$el
      if (!el) return

      if (!(el == event.target || el.contains(event.target))) {
        recordVisible.value.visible = false
        state.selectedRowKeys = []
      }
    }

    const onCloseModalAction = () => {
      recordVisible.value.visible = false
      state.selectedRowKeys = []
    }
    return {
      dataSource,
      pagination,
      columns,
      isLoading,
      t,
      openDelete,
      openReset,
      state,
      rowSelection,
      recordVisible,
      modalActionRef,
      isShowResetPass,
      height,
      params,
      handleDeleteRecord,
      handleEditRecord,
      handleResetPassword,
      handleClickOutsideTable,
      onCloseModalAction,
      customRow,
      handleChange,
      onFilterChange,
      fetchList
    }
  }
})
</script>

<style scoped lang="scss">
.box-create {
  padding: 24px 32px 0;
  text-align: right;
  text-align: -webkit-right;

  .btn-modal {
    width: auto;
    height: 24px;
    border-radius: 2px;
    padding: 1px 8px;
    text-align: center;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .add-icon {
      margin-right: 10.33px;
    }
  }
}
</style>
