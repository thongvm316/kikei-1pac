<template>
  <section class="project__filters">
    <div class="project__buttons">
      <a-button @click="exportProjectAsCsvFile">
        <template #icon>
          <span class="btn-icon"><line-down-icon /></span>
        </template>
        {{ $t('project.export_csv') }}
      </a-button>

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
      class="project__list"
      :columns="columns"
      :data-source="projectDatas"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: true, y: height - 236 }"
      :row-class-name="
        (record, index) => {
          return targetProjectSelected.id === record.id ? 'is-clicked-row' : ''
        }
      "
      :custom-row="onCustomRow"
      @change="changeProjectTable"
    >
      <template #projectNameTitle> {{ $t('project.customer_name') }} / {{ $t('project.project_name') }} </template>

      <template #renderProjectName="{ record }">
        <p class="mb-0 text-grey-55">{{ record.code }}</p>
        <p class="mb-0 text-grey-55">{{ record.companyName }}</p>
        <p class="mb-0 font-bold">{{ record.name }}</p>
      </template>

      <template #renderProjectCombineTypeAStatus="{ record }">
        <div class="d-flex">
          <p class="mb-0 text-grey-55">{{ $t(`project.type_${record.type}`) }}</p>
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
        {{ $filters.number_with_commas(record.money, 2) }}
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

      <template #renderProjectStatisticsDate="{ record }">{{
        $filters.moment_yyyy_mm(record.statisticsFromMonth)
      }}</template>

      <template #renderGroupName="{ record }">{{ record.groupName }}</template>

      <template #renderAccountName="{ record }">{{ record.accountName }}</template>
    </a-table>
  </div>

  <project-search-form @on-search="updateRequestData" />

  <modal-actions
    v-if="isOpenFloatButtons"
    :enable-go-to-deposit="targetProjectSelected.accuracyCode === 'S'"
    @on-go-to-edit="$router.push({ name: 'project-edit', params: { id: targetProjectSelected.id } })"
    @on-go-to-copy="cloneProject"
    @on-go-to-deposit="goToDeposit"
    @on-go-to-delete="isDeleteConfirmModalOpen = true"
  />

  <a-modal v-model:visible="isDeleteConfirmModalOpen" centered :title="$t('project.delete_modal.title')" width="380px">
    <template #footer>
      <p>
        {{ t('project.delete_modal.message', { name: targetProjectSelected?.name }) }}
      </p>
      <a-button @click="isDeleteConfirmModalOpen = false">{{ $t('project.delete_modal.cancel_btn') }}</a-button>
      <a-button type="danger" @click="deleteProjectCaller">{{ $t('project.delete_modal.confirm_btn') }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { getProjectList, deleteProject, exportProject } from './composables/useProject'
import { toOrderBy } from '@/helpers/table'
import ProjectSearchForm from './-components/ProjectSearchForm'
import ModalActions from '@/components/ModalActions'

import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'ProjectPage',

  components: {
    ProjectSearchForm,
    ModalActions,
    LineDownIcon,
    LineAddIcon
  },

  setup() {
    const { t } = useI18n()
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const currentPage = ref(1)
    let pagination = ref({
      pageSize: 10,
      pageNumber: 1
    })
    const height = ref(0)
    const projectDatas = ref([])
    const columns = [
      {
        title: t('project.updated_date'),
        dataIndex: 'updated_at',
        key: 'updated_at',
        slots: {
          customRender: 'renderProjectUpdatedAt'
        },
        ellipsis: true,
        sorter: true
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
        ellipsis: true,
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
        ellipsis: true
      },
      {
        title: t('project.accuracy_name'),
        dataIndex: 'ADProjectAccuracy.order',
        key: 'ADProjectAccuracy.order',
        align: 'center',
        slots: {
          customRender: 'renderProjectAccuracy'
        },
        ellipsis: true,
        sorter: true
      },
      {
        title: t('project.release_date'),
        dataIndex: 'release_date',
        key: 'release_date',
        slots: {
          customRender: 'renderProjectReleaseDate'
        },
        ellipsis: true,
        sorter: true
      },
      {
        dataIndex: 'money',
        key: 'money',
        align: 'right',
        slots: {
          title: 'projectMoneyTitle',
          customRender: 'renderProjectMoney'
        },
        ellipsis: true,
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
        ellipsis: true,
        sorter: true
      },
      {
        title: t('project.group_name'),
        dataIndex: 'ADGroup.name',
        key: 'ADGroup.name',
        ellipsis: true,
        slots: {
          customRender: 'renderGroupName'
        },
        sorter: true
      },
      {
        title: t('project.account_name'),
        dataIndex: 'SEAccount.fullname',
        key: 'SEAccount.fullname',
        ellipsis: true,
        slots: {
          customRender: 'renderAccountName'
        },
        sorter: true
      }
    ]
    const isOpenFloatButtons = ref(false)
    const isDeleteConfirmModalOpen = ref(false)
    const targetProjectSelected = ref({})

    // data and params request
    const requestData = ref({ params: pagination.value })

    const updateRequestData = ({ data = {}, params = {} }) => {
      requestData.value = {
        data: { ...requestData.value.data, ...data },
        params: { ...requestData.value.params, ...params }
      }
    }

    const onCustomRow = (record) => {
      return {
        onClick: () => {
          const targetId = targetProjectSelected.value?.id || ''
          const recordId = record?.id || ''

          if (targetId === recordId) {
            targetProjectSelected.value = {}
            isOpenFloatButtons.value = false
          } else {
            targetProjectSelected.value = record
            isOpenFloatButtons.value = true
          }
        }
      }
    }

    // handle actions
    const cloneProject = () => {
      router.push({ name: 'project-new', query: { selectedId: targetProjectSelected.value.id } })
    }

    const goToDeposit = () => {
      const { name, code, groupId } = targetProjectSelected.value
      if (!name || !code || !groupId) return

      router.push({ name: 'deposit', query: { purpose: `${name} ${code}`, tab: groupId } })
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
        variant: 'success',
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

    onBeforeMount(() => {
      fetchProjectDatas()

      // get inner height
      getInnerHeight()
      window.addEventListener('resize', getInnerHeight)
    })

    watch(
      () => requestData.value,
      () => {
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
      t,
      currentPage,
      loading,
      pagination,
      columns,
      isOpenFloatButtons,
      isDeleteConfirmModalOpen,
      targetProjectSelected,
      height,
      onCustomRow,
      cloneProject,
      goToDeposit,
      projectDatas,
      exportProjectAsCsvFile,
      deleteProjectCaller,
      updateRequestData,
      changeProjectTable,
      getInnerHeight
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
    button + button {
      margin-left: 12px;
    }
  }

  &__pagination {
    margin-top: 16px;
  }

  &__list {
    white-space: nowrap;
  }

  table tbody > tr {
    &.is-clicked-row > td {
      background-color: $color-primary-1 !important;
    }

    td {
      cursor: pointer;

      &:first-child {
        padding-left: 32px !important;
      }
    }
  }

  table thead tr th:first-child {
    padding-left: 32px !important;
  }
}
</style>
