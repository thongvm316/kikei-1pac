<template>
  <section class="project-detail">
    <total-revenue-table />

    <div class="project-detail__wrapper">
      <div class="project-detail__forms">
        <project-form
          v-model:is-loaded-overview-table="isLoadedOverviewTable"
          :project="project"
          edit
          @on-submit-edit-project-form="onSubmitEditProjectForm"
        />

        <budget-table />
      </div>

      <div class="project-detail__history">History</div>
    </div>
  </section>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getProject } from '../composables/useProject'
import ProjectForm from '../-components/ProjectForm'
import TotalRevenueTable from '../-components/TotalRevenueTable'
import BudgetTable from '../-components/BudgetTable'

export default defineComponent({
  name: 'ProjectEditPage',

  components: {
    ProjectForm,
    TotalRevenueTable,
    BudgetTable
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const project = {}
    const isLoadedOverviewTable = ref()

    const fetchProject = async () => {
      isLoadedOverviewTable.value = true
      const paramRequest = {
        timezone: 0 - new Date().getTimezoneOffset() / 60,
        isEdit: true
      }
      const projectId = route.params.id
      if (!projectId) return

      try {
        project.value = await getProject(projectId, paramRequest)
      } catch (error) {
        if (error.response.status === 403) router.push({ name: 'error-403', query: { private: 'project' } })
      }
    }

    const onSubmitEditProjectForm = async () => {
      await fetchProject()
      isLoadedOverviewTable.value = false
    }

    onBeforeMount(() => {
      fetchProject()
    })

    return {
      project,
      isLoadedOverviewTable,
      onSubmitEditProjectForm
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
  }

  &__dashboard {
    width: 100%;
    height: 100px;
    background-color: green;
    margin-bottom: 32px;
  }

  &__forms {
    flex-basis: 60%;
  }

  &__history {
    flex-basis: 40%;
    height: 500px;
    background-color: chocolate;
  }

  &__financing {
    height: 500px;
    background-color: purple;
    margin-top: 24px;
  }
}
</style>
