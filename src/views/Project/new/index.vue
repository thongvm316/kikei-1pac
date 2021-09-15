<template>
  <section class="project-new">
    <project-form :project="project" />
  </section>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getProject } from '../composables/useProject'
import ProjectForm from '../-components/ProjectForm'

export default defineComponent({
  name: 'ProjectNewPage',

  components: {
    ProjectForm
  },

  setup() {
    const route = useRoute()
    const project = {}

    const fetchProject = async () => {
      const projectId = route.query.selectedId
      if (!projectId) return

      project.value = await getProject(projectId, { isEdit: false })
      project.value.code = ''
      project.value.name = ''
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
