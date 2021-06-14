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
      :scroll="{ x: true }"
      :row-class-name="
        (record, index) => {
          return targetProjectSelected.id === record.id ? 'is-clicked-row' : ''
        }
      "
      :custom-row="onCustomRow"
    >
      <template #projectNameTitle>{{ $t('project.customer_name') }} / {{ $t('project.project_name') }}</template>
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
        <span class="d-inline-block text-right"
          >{{ $t('project.money') }} <br />
          (JPY)
        </span>
      </template>
      <template #renderProjectMoney="{ record }">
        {{ $filters.number_with_commas(record.money) }}
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
    </a-table>
  </div>

  <project-search-form @on-search="fetchProjectDatas($event)" />

  <project-float-buttons
    v-model:visible="isOpenFloatButtons"
    :enable-go-to-deposit="targetProjectSelected.accuracyCode === 'S'"
    @on-go-to-edit-project="$router.push({ name: 'project-edit', params: { id: targetProjectSelected.id } })"
    @on-confirm-delete="isDeleteConfirmModalOpen = true"
    @on-copy-project="cloneProject"
    @on-go-to-deposit="goToDeposit"
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
import ProjectSearchForm from './-components/ProjectSearchForm'
import ProjectFloatButtons from './-components/ProjectFloatButtons'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'ProjectPage',

  components: {
    ProjectSearchForm,
    ProjectFloatButtons,
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
    const projectDatas = ref([])
    const columns = [
      {
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        title: t('project.updated_date'),
        slots: {
          customRender: 'renderProjectUpdatedAt'
        },
        sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      },
      {
        dataIndex: 'projectCombineName',
        key: 'projectCombineName',
        align: 'left',
        colSpan: 2,
        slots: {
          title: 'projectNameTitle',
          customRender: 'renderProjectName'
        },
        sorter: (a, b) => a.companyName.localeCompare(b.companyName)
      },
      {
        dataIndex: 'projectCombineTypeAStatus',
        key: 'projectCombineTypeAStatus',
        title: '',
        colSpan: 0,
        slots: {
          customRender: 'renderProjectCombineTypeAStatus'
        }
      },
      {
        dataIndex: 'accuracyCode',
        key: 'accuracyCode',
        align: 'center',
        title: t('project.accuracy_name'),
        slots: {
          customRender: 'renderProjectAccuracy'
        },
        sorter: (a, b) => a.accuracyCode.localeCompare(b.accuracyCode)
      },
      {
        dataIndex: 'releaseDate',
        key: 'releaseDate',
        title: t('project.release_date'),
        slots: {
          customRender: 'renderProjectReleaseDate'
        },
        sorter: (a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      },
      {
        dataIndex: 'money',
        key: 'money',
        align: 'right',
        slots: {
          title: 'projectMoneyTitle',
          customRender: 'renderProjectMoney'
        },
        sorter: (a, b) => a.money - b.money
      },
      {
        dataIndex: 'statisticsFromMonth',
        key: 'statisticsFromMonth',
        title: t('project.statistics_from_month'),
        align: 'center',
        slots: {
          customRender: 'renderProjectStatisticsDate'
        },
        sorter: (a, b) => new Date(a.statisticsFromMonth).getTime() - new Date(b.statisticsFromMonth).getTime()
      },
      {
        dataIndex: 'groupName',
        key: 'groupName',
        title: t('project.group_name'),
        sorter: (a, b) => a.groupName.localeCompare(b.groupName)
      },
      {
        dataIndex: 'accountName',
        key: 'accountName',
        title: t('project.account_name'),
        sorter: (a, b) => a.accountName.localeCompare(b.accountName)
      }
    ]
    const isOpenFloatButtons = ref(false)
    const isDeleteConfirmModalOpen = ref(false)
    const targetProjectSelected = ref({})

    const onCustomRow = (record) => {
      return {
        onClick: () => {
          targetProjectSelected.value = record
          isOpenFloatButtons.value = true
        }
      }
    }

    const cloneProject = () => {
      router.push({ name: 'project-new', query: { selectedId: targetProjectSelected.value.id } })
    }

    const goToDeposit = () => {
      const { name, code, groupId } = targetProjectSelected.value
      if (!name || !code || !groupId) return

      router.push({ name: 'deposit', query: { purpose: `${name} ${code}`, tab: groupId } })
    }

    const fetchProjectDatas = async (data = null) => {
      pagination.value.pageNumber = currentPage
      const { projectList, pageData } = await getProjectList(pagination.value, loading, data)
      projectDatas.value = projectList
      pagination.value = pageData
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

      // clear selected value
      targetProjectSelected.value = {}
      // show notification
      store.commit('flash/STORE_FLASH_MESSAGE', {
        variant: 'success',
        duration: 5,
        message: 'project.flash_message.delete_success'
      })
    }

    onBeforeMount(() => {
      fetchProjectDatas()
    })
    watch(currentPage, fetchProjectDatas)
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
      onCustomRow,
      cloneProject,
      goToDeposit,
      projectDatas,
      fetchProjectDatas,
      exportProjectAsCsvFile,
      deleteProjectCaller
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/mixins';
@import '@/styles/shared/variables';

.project {
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
    }
  }
}
</style>
