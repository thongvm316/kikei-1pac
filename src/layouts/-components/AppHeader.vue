<template>
  <a-layout-header class="header" mode="horizontal">
    Header
  </a-layout-header>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHeader'
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.header {
  background-color: $color-grey-100;
  color: $color-grey-15;
}
</style>
