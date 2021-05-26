<template>
  <div class="project-empty-section">
    <span class="project-empty-section__icon">
      <project-empty-state-icon />
    </span>

    <h2 class="project-empty-section__headline headline--lg">まだプロジェクトがありません。</h2>
    <p class="project-empty-section__desc">
      新規プロジェクトを追加するには、
      <br/>
      <router-link
        :to="{ name: 'project-new' }"
        class="link--primary">ここをクリック</router-link>
      してください。
    </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import ProjectEmptyStateIcon from '@/assets/icons/ico_project-empty-state.svg'

export default defineComponent({
  name: 'ProjectEmptyState',

  components: {
    ProjectEmptyStateIcon
  }
})
</script>

<style lang="scss" scoped>
.project-empty-section {
  max-width: 100%;
  width: 300px;
  margin: 80px auto;
  text-align: center;

  &__icon svg, {
    display: inline-block;
  }

  &__headline {
    margin-top: 18px
  }

  &__desc {
    font-size: 16px;
    line-height: 24px;
    margin-top: 12px
  }
}
</style>
