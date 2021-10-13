<template>
  <section class="project-detail">
    <div class="project-detail__dashboard">dashboard table</div>

    <div class="project-detail__wrapper">
      <div class="project-detail__forms">
        <project-form :project="project" edit />

        <div class="project-detail__financing">Financing tabel</div>
      </div>

      <div class="project-detail__history">History</div>
    </div>
  </section>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProject } from '../composables/useProject'
import ProjectForm from '../-components/ProjectForm'

export default defineComponent({
  name: 'ProjectEditPage',

  components: {
    ProjectForm
  },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const project = {}

    const fetchProject = async () => {
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

    onBeforeMount(() => {
      fetchProject()
    })

    return {
      project
    }
  }
})
</script>

<style lang="scss" scoped>
.project-detail {
  &__wrapper {
    display: flex;
    gap: 32px;
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
