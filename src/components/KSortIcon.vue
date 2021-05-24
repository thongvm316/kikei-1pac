<template>
  <div class="xxx">
    <caret-up-icon />
    <caret-down-icon class="u-mt-2" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CaretUpIcon from '@/assets/ico_caret-up.svg'
import CaretDownIcon from '@/assets/ico_caret-down.svg'

export default defineComponent({
  name: 'KSortIcon',

  components: {
    CaretUpIcon,
    CaretDownIcon
  }
})
</script>

<style lang="scss" scoped>
.xxx {
  display: flex;
  flex-direction: column;
}
</style>
