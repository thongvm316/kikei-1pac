<template>
  <section class="project-new">
    <project-form :project="project" />
  </section>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProject } from '../composables/useProject'
import ProjectForm from '../-components/ProjectForm'

export default defineComponent({
  name: 'ProjectNewPage',

  setup() {
    const route = useRoute()
    const router = useRouter()
    const project = {}

    const fetchProject = async () => {
      const projectId = route.query.selectedId
      if (!projectId) return

      project.value = await getProject(projectId)
      router.replace({ query: {} })
    }

    onBeforeMount(() => { fetchProject() })

    return {
      project
    }
  },

  components: {
    ProjectForm
  }
})
</script>

<style scoped>
.project-new {
  padding: 32px;
}
</style>
