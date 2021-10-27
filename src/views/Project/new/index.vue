<template>
  <section class="project-new">
    <project-add-form :project="project" />
  </section>
</template>

<script>
import { defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getProject } from '../composables/useProject'
import ProjectAddForm from './-components/ProjectAddForm.vue'

export default defineComponent({
  name: 'ProjectNewPage',

  components: {
    ProjectAddForm
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
