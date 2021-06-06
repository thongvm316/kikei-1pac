<template>
  <section class="project-new">
    <project-form />
  </section>
</template>

<script>
import { defineComponent } from 'vue'
import ProjectForm from '../-components/ProjectForm'

export default defineComponent({
  name: 'ProjectNewPage',

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
