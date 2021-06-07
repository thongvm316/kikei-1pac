<template>
  <section class="project__filters">
    <div class="project__buttons">
      <a-button @click="exportProjectAsCsvFile">
        <template #icon>
          <span class="btn-icon"><line-down-icon /></span>
        </template>
        CSVファイルダウンロード
      </a-button>

      <a-button @click="$router.push({ name: 'project-new' })" type="primary">
        <template #icon>
          <span class="btn-icon"><line-add-icon /></span>
        </template>
        新規プロジェクト追加
      </a-button>
    </div>

    <a-pagination
      class="project__pagination"
      v-model:current="currentPage"
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
      :locale="{ emptyText: '該当するプロジェクトが見つかりませんでした。' }"
      :pagination="false"
      :scroll="{ x: true }"
      :custom-row="onCustomRow">

      <template #projectNameTitle>{{ $t('project.customer_name') }} / {{ $t('project.project_name') }}</template>
      <template #renderProjectName="{ record }">
        <p class="mb-0 text-grey-55">{{ record.code }}</p>
        <p class="mb-0 text-grey-55">{{ record.name }}</p>
        <p class="mb-0 font-bold">{{ record.companyName }}</p>
      </template>

      <template #projectMoneyTitle>
        <span class="d-inline-block text-right">{{ $t('project.money') }} <br /> (JPY) </span>
      </template>
      <template #renderProjectMoney="{ record }">
        {{ $filters.number_with_commas(record.money) }}
      </template>

      <template #renderProjectAccuracy="{ record }">
        <p
          v-if="record.accuracyName.toUpperCase() === 'S'"
          class="mb-0 text-center font-bold text-additional-blue-6">
          <a-tooltip color="#262626" :title="record.accuracyName">
            {{ record.accuracyName }}
          </a-tooltip>
        </p>
        <p v-else class="mb-0 text-center font-bold text-grey-55">
          <a-tooltip color="#262626" :title="record.accuracyName">
            {{ record.accuracyName }}
          </a-tooltip>
        </p>
      </template>

      <template #renderProjectUpdatedAt="{ record }">{{ $filters.moment_l(record.updatedAt) }}</template>

      <template #renderProjectReleaseDate="{ record }">{{ $filters.moment_l(record.releaseDate) }}</template>

      <template #renderProjectStatisticsDate="{ record }">{{ $filters.moment_l(record.statisticsFromMonth) }}</template>
    </a-table>
  </div>

  <project-search-form @on-search="fetchProjectDatas($event)" />

  <project-float-buttons
    v-model:visible="isOpenFloatButtons"
    @on-go-to-edit-project="$router.push({ name: 'project-edit', params: { id:targetProjectSelected.id} })"
    @on-confirm-delete="isDeleteConfirmModalOpen = true"
  />

  <a-modal
    v-model:visible="isDeleteConfirmModalOpen"
    title="削除"
    width="380px">
    <template #footer>
      <p>プロジェクト名 を削除してもよろしですか？</p>
      <a-button @click="isDeleteConfirmModalOpen = false">キャンセル</a-button>
      <a-button @click="deleteProjectCaller" type="danger">削除</a-button>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { notification } from 'ant-design-vue'
import { exportCSVFile } from '@/helpers/export-csv-file'
import { getProjectList, deleteProject } from './composables/useProject'
import ProjectSearchForm from './-components/ProjectSearchForm'
import ProjectFloatButtons from './-components/ProjectFloatButtons'
import LineDownIcon from '@/assets/icons/ico_line-down.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'ProjectPage',

  setup() {
    const { t } = useI18n()
    const loading = ref(false)
    const currentPage = ref(1)
    let pagination = ref({
      pageSize: 10,
      pageNumber: 1
    });
    const projectDatas = ref([])
    const columns = [
      {
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        title: t('project.updated_date'),
        slots: {
          customRender: 'renderProjectUpdatedAt'
        },
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        dataIndex: 'projectCombineName',
        key: 'projectCombineName',
        colSpan: 3,
        slots: {
          title: 'projectNameTitle',
          customRender: 'renderProjectName'
        },
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        dataIndex: 'typeName',
        key: 'typeName',
        title: '',
        colSpan: 0,
      },
      {
        dataIndex: 'statusName',
        key: 'statusName',
        title: '',
        colSpan: 0,
      },
      {
        dataIndex: 'accuracyName',
        key: 'accuracyName',
        title: t('project.accuracy_name'),
        slots: {
          customRender: 'renderProjectAccuracy'
        },
        sorter: (a, b) => a.accuracyName - b.accuracyName
      },
      {
        dataIndex: 'releaseDate',
        key: 'releaseDate',
        title: t('project.release_date'),
        slots: {
          customRender: 'renderProjectReleaseDate'
        },
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        dataIndex: 'money',
        key: 'money',
        slots: {
          title: 'projectMoneyTitle',
          customRender: 'renderProjectMoney'
        },
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        dataIndex: 'statisticsFromMonth',
        key: 'statisticsFromMonth',
        title: t('project.statistics_from_month'),
        slots: {
          customRender: 'renderProjectStatisticsDate'
        },
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        dataIndex: 'groupName',
        key: 'groupName',
        title: t('project.group_name'),
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        dataIndex: 'accountName',
        key: 'accountName',
        title: t('project.account_name'),
        sorter: (a, b) => a.name.length - b.name.length
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

    const exportObj = reactive({
      header: [
        t('project.updated_date'),
        'Project Code',
        t('project.project_name'),
        'Company Name',
        t('project.type'),
        t('project.status'),
        t('project.accuracy_name'),
        t('project.release_date'),
        t('project.money'),
        t('project.statistics_from_month'),
        t('project.group_name'),
        t('project.account_name')
      ],
      fileTitle: 'project',
      labels: [
        { field: 'updatedAt', formatBy: 'moment_l' },
        'code',
        'name',
        'companyName',
        'typeName',
        'statusName',
        'accuracyName',
        { field: 'releaseDate', formatBy: 'moment_l' },
        'money',
        { field: 'statisticsFromMonth', formatBy: 'moment_l' },
        'groupName',
        'accountName'
      ],
      items: []
    })

    const fetchProjectDatas = async (data = null) => {
      pagination.value.pageNumber = currentPage
      const { projectList, pageData } = await getProjectList(pagination.value, loading, data)
      projectDatas.value = projectList
      pagination.value = pageData
    }

    const exportProjectAsCsvFile = async () => {
      const { projectList } = await getProjectList({ pageSize: 99999, pageNumber: 1 }, loading)
      console.log(projectList)
      exportObj.items = projectList
      exportCSVFile(exportObj)
    }

    const deleteProjectCaller = async () => {
      if (!targetProjectSelected.value || (targetProjectSelected.value && !targetProjectSelected.value.id)) return
      await deleteProject(targetProjectSelected.value.id)

      // remove data in list
      const index = projectDatas.value.findIndex(project => project.id === targetProjectSelected.value.id)
      projectDatas.value.splice(index, 1)

      // close all modal
      isDeleteConfirmModalOpen.value = false
      isOpenFloatButtons.value = false

      // clear selected value
      targetProjectSelected.value = {}
      // show notification
      notification.open({ message: 'プロジェクト名 を削除しました', placement: 'bottomLeft', duration: 5, class: 'success' });
    }

    onBeforeMount(() => { fetchProjectDatas() })

    watch(currentPage, fetchProjectDatas)

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
      projectDatas,
      fetchProjectDatas,
      exportProjectAsCsvFile,
      deleteProjectCaller
    }
  },

  components: {
    ProjectSearchForm,
    ProjectFloatButtons,
    LineDownIcon,
    LineAddIcon
  }
})
</script>

<style lang="scss" scoped>
  @import '@/styles/shared/mixins';

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
  }

  :deep(.ant-table-tbody > tr > td) {
    cursor: pointer;
  }

  :deep(.ant-table-tbody > tr > td:nth-child(3)),
  :deep(.ant-table-tbody > tr > td:nth-child(4)) {
    padding: 0;
  }

  :deep(.ant-table-tbody > tr > td:nth-child(3)) {
    padding-right: 8px;
  }
</style>
