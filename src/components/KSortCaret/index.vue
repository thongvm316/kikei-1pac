<template>
  <div class="k-sort-icon">
    <caret-up-icon
      :class="{ 'active': byAsc && !byNone }"
      @click="sort(sortBy.asc)" />
    <caret-down-icon
      :class="{ 'active': byDesc && !byNone }"
      @click="sort(sortBy.desc)" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { SORT_BY } from './constants'
import CaretUpIcon from '@/assets/icons/ico_caret-up.svg'
import CaretDownIcon from '@/assets/icons/ico_caret-down.svg'

export default defineComponent({
  name: 'KSortCaret',

  data() {
    return {
      localSort: SORT_BY.none,
      sortBy: SORT_BY
    }
  },

  computed: {
    byAsc() {
      return this.localSort === SORT_BY.asc
    },

    byDesc() {
      return this.localSort === SORT_BY.desc
    },

    byNone() {
      return this.localSort === SORT_BY.none
    }
  },

  components: {
    CaretUpIcon,
    CaretDownIcon
  },

  methods: {
    sort(by) {
      // clear sort if double click
      if (this.localSort === by) {
        this.localSort = SORT_BY.none
        this.$emit('sort-none')
        return
      }

      // emit sort
      this.localSort = by
      this.$emit(`sort-${by}`)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/mixins';

.k-sort-icon {
  @include flexbox(flex-start, center);
  flex-direction: column;
  cursor: pointer;
  color: #d9d9d9; // grey-85

  svg + svg {
    margin-top: 2px;
  }

  svg:hover,
  svg.active {
    color: #fff; // grey-100
  }
}
</style>
