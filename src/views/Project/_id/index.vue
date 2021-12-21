<template>
  <section class="project-detail">
    <total-revenue-table :finance="finance" />

    <div class="project-detail__wrapper">
      <div :class="['project-detail__forms', isMinimiseProjectHistory && 'active']">
        <project-edit-form
          v-if="!!projectRef"
          v-model:is-loaded-overview-table="isLoadedOverviewTable"
          :project="project"
          :project-ref="projectRef"
          :data-groups="dataGroups"
          :data-accounts="dataAccounts"
          :data-statuses="dataStatuses"
          :data-accuracies="dataAccuracies"
          @on-submit-edit-project-form="onSubmitEditProjectForm"
        />

        <budget-table
          v-if="!!projectRef"
          :data-accounts="dataAccounts"
          :data-groups="dataGroups"
          :project="project"
          :project-ref="projectRef"
          @on-submit-predict-budget="onSubmitPredictBudget"
          @on-update-total-revenue="onUpdateTotalRevenue"
        />
      </div>

      <div :class="['project-detail__history', isMinimiseProjectHistory && 'active']">
        <ProjectHistory
          :data-groups="dataGroups"
          :data-accounts="dataAccounts"
          :data-statuses="dataStatuses"
          :data-accuracies="dataAccuracies"
          :project-history="project?.value?.adProjectHistories"
          :project-type="project?.value?.type"
          @on-collapse-project-history="onCollapseProjectHistory"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getProject, getProjectAccuracies, getProjectStatuses } from '../composables/useProject'
import ProjectEditForm from './components/ProjectEditForm'
import TotalRevenueTable from './components/TotalRevenueTable'
import BudgetTable from './components/BudgetTable'
import ProjectHistory from './components/ProjectHistory.vue'
import { useAccountList } from '../composables/useAccountList'
import { useGroupList } from '../composables/useGroupList'

export default defineComponent({
  name: 'ProjectEditPage',

  components: {
    ProjectEditForm,
    TotalRevenueTable,
    BudgetTable,
    ProjectHistory
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const project = {}
    const isLoadedOverviewTable = ref()
    const finance = ref()
    const projectRef = ref()
    const isMinimiseProjectHistory = ref()

    const onCollapseProjectHistory = (val) => {
      isMinimiseProjectHistory.value = val
    }

    const fetchProject = async () => {
      isLoadedOverviewTable.value = true
      const paramRequest = {
        timezone: 0 - new Date().getTimezoneOffset() / 60,
        isEdit: true
      }
      const projectId = route.params.id
      if (!projectId) return

      try {
        const projectRes = await getProject(projectId, paramRequest)
        project.value = projectRes
        finance.value = projectRes
        projectRef.value = projectRes
      } catch (error) {
        if (error.response.status === 403) router.push({ name: 'error-403', query: { private: 'project' } })
      }
    }

    const onSubmitEditProjectForm = async () => {
      await fetchProject()
      isLoadedOverviewTable.value = false
    }

    const onUpdateTotalRevenue = async () => {
      await fetchProject()
    }

    const dataAccounts = ref()
    const dataGroups = ref()
    const dataStatuses = ref()
    const dataAccuracies = ref()

    onBeforeMount(async () => {
      // accounts
      dataAccounts.value = await useAccountList({ types: '0,2', active: true })
      // groups
      const paramsGroup = { allGroup: true }
      const { data: groups } = await useGroupList(paramsGroup)
      dataGroups.value = groups

      // statuses
      const { data: statuses } = await getProjectStatuses()
      dataStatuses.value = statuses
      // accuracies
      const { data: accuracies } = await getProjectAccuracies()
      dataAccuracies.value = accuracies

      await fetchProject()
    })

    return {
      project,
      finance,
      isLoadedOverviewTable,
      projectRef,
      dataAccounts,
      dataStatuses,
      dataAccuracies,
      dataGroups,
      isMinimiseProjectHistory,

      onSubmitEditProjectForm,
      onCollapseProjectHistory,
      onUpdateTotalRevenue
    }
  }
})
</script>

<style lang="scss" scoped>
.project-detail {
  &__wrapper {
    display: flex;
    gap: 32px;
    margin-top: 32px;
    overflow-x: auto;
  }

  &__forms {
    flex-basis: 60%;

    &.active {
      flex-basis: 80%;
    }
  }

  &__history {
    flex-basis: 40%;
    min-width: 335px;

    &.active {
      flex-basis: 20%;
    }
  }
}
</style>
