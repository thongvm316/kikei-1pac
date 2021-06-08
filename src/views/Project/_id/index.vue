<template>
  <section class="project-new">
    <project-form :project="project" />
  </section>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import ProjectForm from '../-components/ProjectForm'
import { getProject } from '../composables/useProject'

export default defineComponent({
  name: 'ProjectEditPage',

  components: {
    ProjectForm
  },

  setup() {
    const route = useRoute()
    const project = {}

    const fetchProject = async () => {
      const projectId = route.params.id
      if (!projectId) return

      project.value = await getProject(projectId)
      console.log(project.value)
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
