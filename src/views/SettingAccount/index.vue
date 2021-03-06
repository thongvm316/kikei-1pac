<template>
  <section class="account-wrap">
    <div class="u-flex u-justify-between u-items-center u-mt-24 u-mb-16 u-mx-32">
      <!-- Keyword -->
      <a-input-search
        v-model:value="requestParamsData.data.keySearch"
        :placeholder="$t('account.search_input_placeholder')"
        allow-clear
        class="account-wrap__key-search"
        @search="onInputChange"
      />

      <div class="u-flex u-items-center">
        <!-- csv -->
        <a-tooltip color="#fff" :title="$t('deposit.deposit_list.export_csv')">
          <a-button class="u-mr-16" type="link" :loading="isLoadingExportCsv" @click="handleExportCsv">
            <template #icon>
              <span class="btn-icon" :style="{ height: '28px' }"><line-down-icon /></span>
            </template>
          </a-button>
        </a-tooltip>

        <!-- add account -->
        <a-button class="btn-modal" type="primary" @click="$router.push({ name: 'account-new', query: $route.query })">
          <add-icon class="add-icon" />
          {{ $t('account.add_account') }}
        </a-button>
      </div>
    </div>

    <div class="u-flex u-justify-end u-items-center u-mb-8 u-mx-32">
      <a-pagination
        :current="pagination.pageNumber"
        :total="pagination.totalRecords"
        :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
        :page-size="pagination.pageSize"
        size="small"
        @change="onChangeCurrentPage"
      />
    </div>

    <a-tabs
      v-model:active-key="activeKeyGroup"
      default-active-key="1"
      class="-mx-32"
      :animated="false"
      @change="handleChangeGroup"
    >
      <a-tab-pane v-for="item in groupList" :key="item.id" :tab="item.name" />
    </a-tabs>

    <a-table
      id="list-table"
      v-click-outside="handleClickOutsideTable"
      :columns="columns"
      :data-source="dataSource"
      :row-key="(record) => record.id"
      :loading="isLoading"
      :pagination="false"
      :custom-row="customRow"
      :row-selection="rowSelection"
      :scroll="{ y: height - 264 }"
      :locale="localeTable"
      size="middle"
      @change="handleAccountTableChange"
    >
      <template #renderCreatedAt="{ record }">{{ $filters.moment_l(record.createdAt) }}</template>

      <template #status="{ text: status }">
        <div class="columns-status">
          <p class="point-status" :style="{ backgroundColor: tagsAction(status).backgroundColor }"></p>
          <p class="text-status" :style="{ color: tagsAction(status).backgroundColor }">
            {{ tagsAction(status).value }}
          </p>
        </div>
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

    <ModalDelete v-model:visible="openDelete" :name="recordVisible.username" @delete="handleDeleteRecord($event)" />
    <ModalReset v-model:visible="openReset" :name="recordVisible.username" @reset="handleResetPassword($event)" />
  </section>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { forEach, keys, includes, find, cloneDeep, parseInt, isEqual } from 'lodash-es'
import humps from 'humps'
import moment from 'moment'

import useGetAccountListService from '@/views/SettingAccount/composables/useGetAccountListService'
import useDeleteAccountService from '@/views/SettingAccount/composables/useDeleteAccountService'
import useResetPasswordAccountService from '@/views/SettingAccount/composables/useResetPasswordAccountService'
import { deleteEmptyValue } from '@/helpers/delete-empty-value'
import { getGroups } from './composables/useGroupService'
import { toOrderBy } from '@/helpers/table'
import { exportCSVFile } from '@/helpers/export-csv-file'

import Table from '@/mixins/table.mixin'
import AddIcon from '@/assets/icons/ico_line-add.svg'
import ModalAction from '@/components/ModalAction'
import ModalDelete from '@/components/ModalDelete'
import ModalReset from '@/components/ModalReset'
import Services from '@/services'
import storageKeys from '@/enums/storage-keys'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'

const StorageService = Services.get('StorageService')

export default defineComponent({
  name: 'AccountPage',

  components: { ModalAction, AddIcon, ModalDelete, ModalReset, LineDownIcon },

  mixins: [Table],

  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, locale } = useI18n()
    const store = useStore()

    const openDelete = ref(false)
    const openReset = ref(false)
    const dataSource = ref([])
    const pagination = ref({
      pageNumber: 1,
      pageSize: 50,
      totalRecords: 0
    })
    const isLoading = ref(false)
    const recordVisible = ref({})
    const modalActionRef = ref()
    const isShowResetPass = ref(false)
    const height = ref(0)

    // group
    const activeKeyGroup = ref()
    const groupList = ref([])
    const GROUP_ID_ALL = -1

    // CSV
    const isLoadingExportCsv = ref(false)

    // data for request account
    const initialDataRequest = {
      keySearch: '',
      groupId: []
      // type: []
    }

    const localeTable = {
      emptyText: t('account.empty_text_table')
    }

    const requestParamsData = ref({
      data: { ...initialDataRequest },
      params: { ...cloneDeep(pagination.value), orderBy: 'username asc' }
    })

    const updateParamRequestAccount = ({ data = {}, params = {} }) => {
      requestParamsData.value = {
        data: { ...requestParamsData.value.data, ...data },
        params: { ...requestParamsData.value.params, ...params }
      }
    }

    const state = reactive({ selectedRowKeys: [] })
    let tempRow = reactive([])

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: state.selectedRowKeys,
        columnWidth: 0,
        type: 'radio'
      }
    })

    const columns = [
      {
        title: t('account.created_at'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        slots: {
          customRender: 'renderCreatedAt'
        }
      },
      {
        title: t('account.email'),
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
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        slots: { customRender: 'status' }
      }
    ]

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    // sort table
    const handleAccountTableChange = async (pagination, filters, sorter) => {
      const orderBy = toOrderBy(sorter.order)
      const field = humps.decamelize(sorter.field)
      let currentSortStr = null
      if (orderBy !== null) {
        currentSortStr = `${field} ${orderBy}`
      }

      updateParamRequestAccount({ params: { orderBy: currentSortStr, pageNumber: 1 } })
    }

    const onInputChange = async (val) => {
      updateParamRequestAccount({ data: { keySearch: val } })
    }

    const handleDeleteRecord = async () => {
      try {
        const { deleteAccount } = useDeleteAccountService(recordVisible.value.id)
        const response = await deleteAccount()

        if (response.status === 200) {
          //show notification
          store.commit('flash/STORE_FLASH_MESSAGE', {
            variant: 'successfully',
            duration: 5,
            message: t('account.delete_account', { username: recordVisible.value.username })
          })

          await fetchDataTableAccount()
        }
      } catch (error) {
        console.log(error)
      } finally {
        openDelete.value = false
        recordVisible.value.visible = false
      }
    }

    const handleEditRecord = () => {
      router.push({
        name: 'account-edit',
        params: {
          id: recordVisible.value.id
        },
        query: route.query
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
      await fetchDataTableAccount()

      //show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message:
          locale.value === 'en'
            ? 'Password reset' + recordVisible.value.username + ' was successful'
            : recordVisible.value.username + ' のアカウントのパスワードのリセットが成功しました'
      })
    }

    const fetchDataTableAccount = async () => {
      isLoading.value = true
      try {
        const { getAccounts } = useGetAccountListService(requestParamsData.value.params, requestParamsData.value.data)
        const { result } = await getAccounts()

        dataSource.value = result?.data || []

        const { pageNumber, pageSize, totalRecords } = result?.meta || {}
        pagination.value = {
          ...pagination.value,
          pageNumber: parseInt(pageNumber),
          pageSize: parseInt(pageSize),
          totalRecords: parseInt(totalRecords)
        }
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

      if (!(el === event.target || el.contains(event.target))) {
        recordVisible.value.visible = false
        state.selectedRowKeys = []
      }
    }

    const onCloseModalAction = () => {
      recordVisible.value.visible = false
      state.selectedRowKeys = []
    }

    const handleExportCsv = () => {
      const labels = [
        { header: t('account.csv.all_group'), field: 'group' },
        { header: t('account.created_at'), field: 'createdAt' },
        { header: t('account.email'), field: 'username' },
        { header: t('account.full_name'), field: 'fullname' },
        { header: t('account.status'), field: 'active' }
      ]

      const groupFound = find(groupList.value, { id: activeKeyGroup.value })
      const groupCurentName = groupFound?.name || ''

      const items = (dataSource.value || []).map((item) => ({
        group: groupCurentName,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD'),
        username: item.username,
        fullname: item.fullname,
        active: item.active ? t('account.in_use') : t('account.retired')
      }))

      const exportObj = {
        fileTitle: 'AD9900',
        labels,
        items
      }
      exportCSVFile(exportObj)
    }

    const onChangeCurrentPage = (val) => {
      pagination.value = { ...pagination.value, page_number: val }
      updateParamRequestAccount({ params: { pageNumber: val } })
    }

    const handleChangeGroup = (val) => {
      const groupId =
        val !== GROUP_ID_ALL
          ? [val]
          : groupList.value.filter((group) => group.id !== GROUP_ID_ALL).map((group) => group.id)

      updateParamRequestAccount({ data: { groupId }, params: { pageNumber: 1 } })
    }

    const tagsAction = (status) => {
      if (status.includes('activate')) {
        return { backgroundColor: '#52C41A', value: t('account.status_activte') }
      } else if (status.includes('deactive')) {
        return { backgroundColor: '#F5222D', value: t('account.status_deactivte') }
      } else {
        return { backgroundColor: '#8C8C8C', value: t('account.status_pending') }
      }
    }

    onMounted(async () => {
      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)

      // check account admin
      StorageService.get(storageKeys.authProfile).isAdmin
        ? (isShowResetPass.value = true)
        : (isShowResetPass.value = false)

      // group list
      const groupsReponse = await getGroups({ allGroup: true })
      const groupsListData = groupsReponse?.result?.data || []
      if (groupsListData.length > 1) {
        // add item
        groupsListData.push({
          id: GROUP_ID_ALL,
          name: t('account.all_group')
        })
      }
      groupList.value = groupsListData

      // get param from query
      const paramsRequest = {}
      const dataRequest = {}
      if (keys(route.query).length > 0) {
        forEach(route.query, (value, key) => {
          const keyCamelize = humps.camelize(key)

          if (includes(['pageNumber', 'pageSize'], keyCamelize)) {
            paramsRequest[keyCamelize] = Number(value)
          } else if (includes(['orderBy'], keyCamelize)) {
            paramsRequest[keyCamelize] = value
          } else if (includes(['groupId'], keyCamelize)) {
            dataRequest[keyCamelize] = value === 'all' ? value : [Number(value)]
          } else {
            dataRequest[keyCamelize] = value
          }
        })
      }

      // get group
      if (!dataRequest.groupId) {
        // default is first group
        const groupId = groupList.value[0]?.id ? [groupList.value[0].id] : []
        dataRequest.groupId = groupId
        groupId.length > 0 && (activeKeyGroup.value = groupId[0])
      } else if (dataRequest.groupId === 'all') {
        // from query
        dataRequest.groupId = groupList.value.filter((group) => group.id !== GROUP_ID_ALL).map((group) => group.id)
        activeKeyGroup.value = groupList.value[groupList.value.length - 1].id
      } else {
        // from query
        const groupFound = find(groupList.value, { id: dataRequest.groupId[0] })
        groupFound && (activeKeyGroup.value = groupFound.id)
      }

      updateParamRequestAccount({ params: paramsRequest, data: dataRequest })
    })

    onUnmounted(() => {
      window.removeEventListener('resize', getInnerHeight)
    })

    // watch to fetch data financing
    watch(
      () => requestParamsData.value,
      async () => {
        // fetch data table
        fetchDataTableAccount()

        // save params to query
        const allGroupId = groupList.value.filter((group) => group.id !== GROUP_ID_ALL).map((group) => group.id)
        const isGroupAll = isEqual(allGroupId, requestParamsData.value.data?.groupId)
        const groupId = isGroupAll ? 'all' : [requestParamsData.value.data?.groupId]
        const query = { ...requestParamsData.value.params, ...requestParamsData.value.data, groupId }
        delete query.totalRecords

        await router.push({
          name: 'account',
          query: humps.decamelizeKeys({ ...deleteEmptyValue(query) })
        })
      }
    )

    return {
      dataSource,
      pagination,
      columns,
      isLoading,
      openDelete,
      openReset,
      state,
      rowSelection,
      recordVisible,
      modalActionRef,
      isShowResetPass,
      height,
      isLoadingExportCsv,
      activeKeyGroup,
      groupList,
      requestParamsData,
      localeTable,
      tagsAction,
      handleDeleteRecord,
      handleEditRecord,
      handleResetPassword,
      handleClickOutsideTable,
      onCloseModalAction,
      customRow,
      onInputChange,
      handleExportCsv,
      onChangeCurrentPage,
      handleAccountTableChange,
      handleChangeGroup
    }
  }
})
</script>

<style lang="scss">
.account-wrap {
  .box-create {
    padding: 24px 32px 0;
    text-align: right;
    text-align: -webkit-right;

    .btn-modal {
      width: auto;
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

  &__key-search {
    width: 260px;

    .ant-input-suffix {
      .ant-input-clear-icon {
        margin-right: 10px;
      }
    }
  }

  .ant-table-placeholder {
    padding-top: 48px;
  }

  .columns-status {
    display: flex;
    align-items: center;

    .point-status {
      width: 12px;
      height: 12px;
      margin-bottom: 0;
      margin-right: 4px;
      border-radius: 50%;
    }

    .text-status {
      margin-bottom: 0;
    }
  }
}
</style>
