<template>
  <section class="project-new">
    <project-form :project="project" edit />
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

<style scoped>
.project-new {
  padding: 32px;
}
</style>
