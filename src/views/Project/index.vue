<template>
  <section class="project__filters">
    <div class="project__buttons">
      <a-tooltip color="#fff" :title="$t('project.export_csv')">
        <a-button type="link" @click="exportProjectAsCsvFile">
          <template #icon>
            <span style="height: 28px" class="btn-icon"><line-down-icon /></span>
          </template>
        </a-button>
      </a-tooltip>

      <a-button type="primary" @click="$router.push({ name: 'project-new' })">
        <template #icon>
          <span class="btn-icon"><line-add-icon /></span>
        </template>
        {{ $t('project.add_project_link') }}
      </a-button>
    </div>

    <a-pagination
      v-model:current="currentPage"
      class="project__pagination"
      :total="pagination.totalRecords"
      :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
      :page-size="pagination.pageSize"
      size="small"
    />
  </section>

  <div class="project">
    <a-table
      v-click-outside="handleClickOutsideTable"
      class="project__list"
      :columns="columns"
      :data-source="projectDatas"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: 1400, y: height - 236 }"
      :row-class-name="
        (record, index) => {
          return targetProjectSelected.id === record.id ? 'is-clicked-row' : ''
        }
      "
      :custom-row="onCustomRow"
      :locale="localeTable"
      @change="changeProjectTable"
    >
      <template #renderProjectRead="{ text: read }">
        <div class="column-read">
          <p class="point-status" :style="{ backgroundColor: tagsAction(read).backgroundColor }"></p>
        </div>
      </template>

      <template #projectNameTitle> {{ $t('project.customer_name') }} / {{ $t('project.project_name') }} </template>

      <template #renderProjectName="{ record }">
        <p class="mb-0 text-grey-55">{{ record.code }}</p>
        <p class="mb-0 text-grey-55 u-whitespace-normal">{{ record.companyName }}</p>
        <p class="mb-0 font-bold u-whitespace-normal">{{ record.name }}</p>
      </template>

      <template #renderProjectCombineTypeAStatus="{ record }">
        <div class="u-flex u-items-center">
          <a-tooltip color="#fff" title="メモ">
            <a-button class="btn-memo" type="link" @click="openMemoModal">
              <template #icon>
                <span class="btn-icon"><memo-icon /></span>
              </template>
            </a-button>
          </a-tooltip>

          <p class="mb-0 text-grey-55 u-ml-12">{{ $t(`project.type_${record.type}`) }}</p>
          <p class="mb-0 text-grey-55 u-ml-12">{{ record.statusName }}</p>
        </div>
      </template>

      <template #projectMoneyTitle>
        <div class="d-flex u-items-center">
          <span class="d-inline-block text-right u-mr-8">
            {{ $t('project.money') }} <br />
            (JPY)
          </span>
        </div>
      </template>

      <template #renderProjectMoney="{ record }">
        {{ $filters.number_with_commas(record.estimateMoney) }}
      </template>

      <template #renderProjectAccuracy="{ record }">
        <p v-if="record.accuracyCode.toUpperCase() === 'S'" class="mb-0 text-center font-bold text-additional-blue-6">
          <a-tooltip color="#fff" :title="record.accuracyName">
            {{ record.accuracyCode }}
          </a-tooltip>
        </p>
        <p v-else class="mb-0 text-center font-bold text-grey-55">
          <a-tooltip color="#fff" :title="record.accuracyName">
            {{ record.accuracyCode }}
          </a-tooltip>
        </p>
      </template>

      <template #renderProjectUpdatedAt="{ record }">{{ $filters.moment_l(record.updatedAt) }}</template>

      <template #renderProjectReleaseDate="{ record }">{{ $filters.moment_l(record.releaseDate) }}</template>

      <template #renderProjectStatisticsDate="{ record }">
        <p :class="record.type === 0 ? 'mb-0' : ''">
          {{ $filters.moment_yyyy_mm(record.statisticsFromMonth) }}<span v-if="record.type === 1"> -</span>
        </p>
        <p v-if="record.type === 1" class="u-mb-0">{{ $filters.moment_yyyy_mm(record.statisticsToMonth) }}</p>
      </template>

      <template #renderGroupName="{ record }">{{ record.groupName }}</template>

      <template #renderAccountName="{ record }">{{ record.accountName }}</template>
    </a-table>
  </div>

  <project-search-form @on-search="updateRequestData" />

  <modal-action-bar
    v-if="isOpenFloatButtons"
    ref="modalActionRef"
    :project="true"
    :target-project-selected-created-by-id="targetProjectSelected.createdBy"
    :enable-go-to-deposit="targetProjectSelected.accuracyCode === 'S' && targetProjectSelected.paymentTerm !== 2"
    @on-go-to-edit="goToEditProject"
    @on-go-to-copy="cloneProject"
    @on-go-to-deposit="goToDeposit"
    @on-go-to-delete="isDeleteConfirmModalOpen = true"
    @on-close-modal="onCloseModalAction"
  />

  <a-modal
    v-model:visible="isDeleteConfirmModalOpen"
    class="modal-delete-project-js"
    centered
    :title="$t('project.delete_modal.title')"
    width="380px"
  >
    <template #footer>
      <p>
        {{ $t('project.delete_modal.message', { name: targetProjectSelected?.name }) }}
      </p>
      <a-button type="default" @click="isDeleteConfirmModalOpen = false">
        {{ $t('project.delete_modal.cancel_btn') }}
      </a-button>
      <a-button type="danger" @click="deleteProjectCaller">{{ $t('project.delete_modal.confirm_btn') }}</a-button>
    </template>
  </a-modal>

  <project-memo-modal v-model:visible="isOpenMemoModal" :memo-record-selected="memoRecordSelected" />
</template>

<script>
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { merge } from 'lodash-es'

import { getProjectList, deleteProject, exportProject } from './composables/useProject'
import useGetRecordRead from './composables/useGetRecordRead'
import { toOrderBy } from '@/helpers/table'
import { deepCopy } from '@/helpers/json-parser'
import ProjectSearchForm from './-components/ProjectSearchForm'
import ModalActionBar from '@/components/ModalActionBar'
import ProjectMemoModal from './-components/ProjectMemoModal'
import { STATUS_CODE } from '@/enums/project.enum'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import MemoIcon from '@/assets/icons/ico_memo.svg'

export default defineComponent({
  name: 'ProjectPage',

  components: {
    ProjectSearchForm,
    ModalActionBar,
    LineDownIcon,
    LineAddIcon,
    MemoIcon,
    ProjectMemoModal
  },

  setup() {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()

    const loading = ref(false)
    const currentPage = ref(1)
    let pagination = ref({
      pageSize: 50,
      pageNumber: 1
    })
    const height = ref(0)
    const projectDatas = ref([])
    const clickRecord = ref()
    const columns = [
      {
        dataIndex: 'read',
        key: 'read',
        slots: {
          customRender: 'renderProjectRead'
        }
      },
      {
        title: t('project.updated_date'),
        dataIndex: 'updated_at',
        key: 'updated_at',
        slots: {
          customRender: 'renderProjectUpdatedAt'
        },
        sorter: true,
        width: 120
      },
      {
        dataIndex: 'ADCompany.name',
        key: 'ADCompany.name',
        align: 'left',
        colSpan: 2,
        slots: {
          title: 'projectNameTitle',
          customRender: 'renderProjectName'
        },
        width: 350,
        sorter: true
      },
      {
        dataIndex: 'projectCombineTypeAStatus',
        key: 'projectCombineTypeAStatus',
        title: '',
        colSpan: 0,
        slots: {
          customRender: 'renderProjectCombineTypeAStatus'
        },
        width: 200
      },
      {
        title: t('project.accuracy_name'),
        dataIndex: 'ADProjectAccuracy.order',
        key: 'ADProjectAccuracy.order',
        align: 'center',
        slots: {
          customRender: 'renderProjectAccuracy'
        },
        sorter: true,
        width: 100
      },
      {
        title: t('project.release_date'),
        dataIndex: 'release_date',
        key: 'release_date',
        slots: {
          customRender: 'renderProjectReleaseDate'
        },
        sorter: true,
        width: 120
      },
      {
        dataIndex: 'money',
        key: 'money',
        align: 'right',
        slots: {
          title: 'projectMoneyTitle',
          customRender: 'renderProjectMoney'
        },
        sorter: true
      },
      {
        title: t('project.statistics_from_month'),
        dataIndex: 'statistics_from_month',
        key: 'statistics_from_month',
        align: 'center',
        slots: {
          customRender: 'renderProjectStatisticsDate'
        },
        sorter: true
      },
      {
        title: t('project.group_name'),
        dataIndex: 'ADGroup.name',
        key: 'ADGroup.name',
        slots: {
          customRender: 'renderGroupName'
        },
        sorter: true
      },
      {
        title: t('project.account_name'),
        dataIndex: 'SEAccount.fullname',
        key: 'SEAccount.fullname',
        slots: {
          customRender: 'renderAccountName'
        },
        sorter: true
      }
    ]
    const isOpenFloatButtons = ref(false)
    const isDeleteConfirmModalOpen = ref(false)
    const targetProjectSelected = ref({})
    const localeTable = { emptyText: t('project.project_table_empty') }

    const modalActionRef = ref()

    const isOpenMemoModal = ref()
    const memoRecordSelected = ref()

    // data and params request
    const requestData = ref({ data: { statusCode: STATUS_CODE }, params: pagination.value })

    const updateRequestData = ({ data = {}, params = {} }) => {
      requestData.value = {
        data: { ...requestData.value.data, ...data },
        params: { ...requestData.value.params, ...params }
      }
    }

    const onCustomRow = (record) => {
      return {
        onClick: (e) => {
          if (e.target.classList.contains('btn-memo')) {
            memoRecordSelected.value = record
            return
          }

          const targetId = targetProjectSelected.value?.id || ''
          const recordId = record?.id || ''

          if (!recordId || targetId === recordId) {
            targetProjectSelected.value = {}
            isOpenFloatButtons.value = false
          } else {
            targetProjectSelected.value = record
            isOpenFloatButtons.value = true
            if (!record.read) checkRead(record)
          }
        }
      }
    }

    // handle actions
    const cloneProject = () => {
      router.push({ name: 'project-new', query: { selectedId: targetProjectSelected.value.id } })
    }

    const goToEditProject = () => {
      const projectId = targetProjectSelected.value?.id
      if (!projectId) return

      // save filters search to store
      store.commit('project/STORE_PROJECT_FILTER', requestData.value)

      router.push({ name: 'project-edit', params: { id: projectId } })
    }

    const goToDeposit = () => {
      const { id, groupId } = targetProjectSelected.value
      if (!id || !groupId) return

      // save purpose to deposit store
      store.commit('deposit/STORE_DEPOSIT_FILTER', {
        data: { groupId, projectId: id }
      })

      router.push({ name: 'deposit', query: { tab: groupId } })
    }

    const fetchProjectDatas = async () => {
      const { projectList, pageData } = await getProjectList(requestData.value.params, loading, requestData.value.data)

      projectDatas.value = projectList
      pagination.value = pageData
      pagination.value.pageNumber = requestData.value.params.pageNumber
      currentPage.value = requestData.value.params.pageNumber
    }

    const exportProjectAsCsvFile = async () => {
      const { projectList } = await getProjectList({ pageSize: 99999, pageNumber: 1 }, loading)
      exportProject(projectList)
    }

    const deleteProjectCaller = async () => {
      if (!targetProjectSelected.value || (targetProjectSelected.value && !targetProjectSelected.value.id)) return
      await deleteProject(targetProjectSelected.value.id)

      // remove data in list
      const index = projectDatas.value.findIndex((project) => project.id === targetProjectSelected.value.id)
      projectDatas.value.splice(index, 1)

      // deduct total records
      if (pagination.value.totalRecords && pagination.value.totalRecords > 0) {
        pagination.value.totalRecords -= 1
      }

      // close all modal
      isDeleteConfirmModalOpen.value = false
      isOpenFloatButtons.value = false

      // show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'successfully',
        duration: 5,
        message: t('project.flash_message.delete_success', { name: targetProjectSelected.value?.name || '' })
      })

      // clear selected value
      targetProjectSelected.value = {}
    }

    const changeProjectTable = (pagination, filter, sorter) => {
      const orderBy = toOrderBy(sorter.order)
      let currentSortStr = ''
      if (!orderBy) {
        currentSortStr = null
        return
      }

      currentSortStr = `${sorter.field} ${orderBy}`
      updateRequestData({ params: { orderBy: currentSortStr } })
    }

    const getInnerHeight = () => {
      height.value = window.innerHeight
    }

    // close action bar
    const handleClickOutsideTable = (event) => {
      const elModalDeleteDeposit = document.querySelector('.modal-delete-project-js')
      const elNotOutsideList = [modalActionRef.value?.$el, elModalDeleteDeposit].filter(Boolean)
      if (elNotOutsideList.length === 0) return

      const isElOutside = elNotOutsideList.every((el) => !(el == event.target || el.contains(event.target)))

      if (isElOutside) {
        isOpenFloatButtons.value = false
        targetProjectSelected.value = {}
      }
    }

    const onCloseModalAction = () => {
      isOpenFloatButtons.value = false
      targetProjectSelected.value = {}
    }

    const openMemoModal = () => {
      isOpenMemoModal.value = true
    }

    const tagsAction = (status) => {
      if (!status) {
        return { backgroundColor: '#F5222D' }
      } else {
        return { backgroundColor: 'transparent' }
      }
    }

    const checkRead = async (evt) => {
      const { getRecordRead } = useGetRecordRead(evt.id)
      await getRecordRead()
      evt.read = true
    }

    onBeforeMount(() => {
      // get filters deposit from store
      const filtersProjectStore = store.state.project?.filters || {}

      updateRequestData(merge(deepCopy(filtersProjectStore)))

      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    watch(
      () => requestData.value,
      () => {
        // check groupId for permission
        if (!requestData.value.data?.groupId) return

        fetchProjectDatas()
      }
    )

    watch(currentPage, (val) => {
      updateRequestData({ params: { pageNumber: val } })
    })

    watch(isOpenFloatButtons, (val, oldVal) => {
      if (!val && oldVal) targetProjectSelected.value = {}
    })

    return {
      currentPage,
      loading,
      pagination,
      columns,
      isOpenFloatButtons,
      isDeleteConfirmModalOpen,
      targetProjectSelected,
      height,
      projectDatas,
      localeTable,
      modalActionRef,
      isOpenMemoModal,
      memoRecordSelected,
      clickRecord,

      checkRead,
      tagsAction,
      onCustomRow,
      cloneProject,
      goToDeposit,
      exportProjectAsCsvFile,
      deleteProjectCaller,
      updateRequestData,
      changeProjectTable,
      getInnerHeight,
      goToEditProject,
      handleClickOutsideTable,
      onCloseModalAction,
      openMemoModal
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/mixins';
@import '@/styles/shared/variables';

.project {
  .ant-table-column-sorters {
    display: flex !important;
    align-items: center !important;

    .ant-table-column-sorter {
      margin-bottom: 4px;
    }
  }

  &__filters {
    @include flexbox(flex-end, flex-end);
    flex-direction: column;
    padding: 24px 32px 16px;
  }

  &__buttons {
    display: flex;
    align-content: center;

    button + button {
      margin-left: 16px;
    }
  }

  &__pagination {
    margin-top: 16px;
  }

  &__list {
    white-space: nowrap;

    .ant-table-placeholder {
      padding-top: 48px;
    }

    .ant-table-thead {
      tr > th:first-child {
        width: 12px;
        height: 12px;
      }
    }

    .ant-table-tbody {
      tr > td:first-child {
        width: 12px;
        height: 12px;
      }
    }

    .column-read {
      width: 12px;
      height: 12px;

      .point-status {
        width: 12px;
        height: 12px;
        margin: 0;
        border-radius: 50%;
        background-color: red;
      }

      .text-status {
        margin-bottom: 0;
      }
    }
  }

  .btn-memo svg {
    pointer-events: none;
  }

  table tbody > tr {
    &.is-clicked-row > td {
      background-color: $color-primary-1 !important;
    }

    td {
      cursor: pointer;

      &:first-child {
        padding-left: 12px !important;
      }
    }
  }

  table thead tr th:first-child {
    padding-left: 12px !important;
  }
}
</style>
