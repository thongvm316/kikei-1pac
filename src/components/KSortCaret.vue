<template>
  <div class="k-sort-icon">
    <caret-up-icon @click="$emit('sort-asc')"/>
    <caret-down-icon @click="$emit('sort-desc')" class="u-mt-2" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CaretUpIcon from '@/assets/icons/ico_caret-up.svg'
import CaretDownIcon from '@/assets/icons/ico_caret-down.svg'

export default defineComponent({
  name: 'KSortCaret',

  components: {
    CaretUpIcon,
    CaretDownIcon
  }
})
</script>

<style lang="scss" scoped>
.k-sort-icon {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
</style>
