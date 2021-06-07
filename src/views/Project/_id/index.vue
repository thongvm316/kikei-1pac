<template>
  <section class="project-new">
    <project-form :project="project" />
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import ProjectForm from '../-components/ProjectForm'
// TODO: waiting for api
// import { getProject } from '../composables/useProject'

export default defineComponent({
  name: 'ProjectEditPage',

  components: {
    ProjectForm
  },

  setup() {
    const route = useRoute()
    const fetchProject = () => {
      const projectId = route.params.id
      if (projectId) return
    }
  }
})
</script>

<style scoped>
.project-new {
  padding: 32px;
}
</style>
