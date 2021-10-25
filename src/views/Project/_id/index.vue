<template>
  <section class="project-detail">
    <total-revenue-table :finance="finance" />

    <div class="project-detail__wrapper">
      <div class="project-detail__forms">
        <project-edit-form
          v-model:is-loaded-overview-table="isLoadedOverviewTable"
          :project="project"
          :project-ref="projectRef"
          :revenue-estimate-money-request="revenueEstimateMoneyRequest"
          @on-submit-edit-project-form="onSubmitEditProjectForm"
        />

        <budget-table :project="project" @on-submit-predict-budget="onSubmitPredictBudget" />
      </div>

      <div class="project-detail__history">
        <ProjectHistory :project-history="project?.value?.adProjectHistories" />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getProject } from '../composables/useProject'
import ProjectEditForm from './components/ProjectEditForm'
import TotalRevenueTable from './components/TotalRevenueTable'
import BudgetTable from './components/BudgetTable'
import ProjectHistory from './components/ProjectHistory.vue'

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

    const revenueEstimateMoneyRequest = ref()

    const onSubmitPredictBudget = (dataEmit) => {
      revenueEstimateMoneyRequest.value = dataEmit
    }

    onBeforeMount(() => {
      fetchProject()
    })

    return {
      project,
      finance,
      isLoadedOverviewTable,
      revenueEstimateMoneyRequest,
      projectRef,
      onSubmitEditProjectForm,
      onSubmitPredictBudget
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
  }

  &__history {
    flex-basis: 40%;
    min-width: 335px;
  }
}
</style>
