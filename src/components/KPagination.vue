<template>
  <nav class="pagination-wrapper">
    <p v-if="shower" class="pagination__shower">
      {{ firstItemInPage }}-{{ lastItemInPage }} / {{ totalItem }}件
    </p>

    <ul class="pagination">
      <li :class="['pagination__prev pagination__item', firstPageSelected && 'disabled' ]">
        <a
          @click="prevPage()"
          @keyup.enter="prevPage()"
          class="pagination__link pagination__link--icon"
          :tabindex="firstPageSelected ? -1 : 0">
          <chervon-left-icon />
        </a>
      </li>

      <li
        v-for="(page, index) in pages"
        :key="index"
        :class="[
          'pagination__item',
          page.selected && 'active',
          page.disabled && 'disabled',
          page.breakView && 'pagination__break']">
        <a v-if="page.breakView" class="pagination__link pagination__link--break" tabindex="0">...</a>
        <a v-else-if="page.disabled" class="pagination__link" tabindex="0">{{ page.content }}</a>
        <a
          v-else
          @click="handlePageSelected(page.index + 1)"
          @keyup.enter="handlePageSelected(page.index + 1)"
          class="pagination__link" tabindex="0">{{ page.content }}</a>
      </li>

      <li :class="['pagination__next pagination__item', lastPageSelected && 'disabled']">
        <a
          @click="nextPage()"
          @keyup.enter="nextPage()"
          class="pagination__link pagination__link--icon"
          :tabindex="lastPageSelected ? -1 : 0">
          <chervon-right-icon />
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import { defineComponent } from 'vue'
import ChervonLeftIcon from '@/assets/icons/ico_chervon_left.svg'
import ChervonRightIcon from '@/assets/icons/ico_chervon_right.svg'

export default defineComponent({
  name: 'KPagination',

  data() {
    return {
      innerValue: 1,
      marginPages: 1
    }
  },

  props: {
    value: {
      type: Number,
      required: true
    },

    totalItem: {
      type: Number,
      required: true
    },

    perPage: {
      type: Number,
      required: true
    },

    clickHandler: {
      type: Function,
      default: () => {}
    },

    pageRange: {
      type: Number,
      default: 3
    },

    shower: {
      type: Boolean,
      default: true
    }
  },

  components: {
    ChervonLeftIcon,
    ChervonRightIcon
  },

  computed: {
    selected: {
      get: function() {
        return this.value || this.innerValue
      },

      set: function(newValue) {
        this.innerValue = newValue
      }
    },

    pageCount() {
      return Math.ceil(this.totalItem / this.perPage)
    },

    pages() {
      let items = {}
      if (this.pageCount <= this.pageRange) {
        for (let index = 0; index < this.pageCount; index++) {
          let page = {
            index: index,
            content: index + 1,
            selected: index === (this.selected - 1)
          }
          items[index] = page
        }
      } else {
        const halfPageRange = Math.floor(this.pageRange / 2)

        let setPageItem = index => {
          let page = {
            index: index,
            content: index + 1,
            selected: index === (this.selected - 1)
          }

          items[index] = page
        }

        let setBreakView = index => {
          let breakView = {
            disabled: true,
            breakView: true
          }

          items[index] = breakView
        }

        // 1st - loop thru low end of margin pages
        for (let i = 0; i < this.marginPages; i++) {
          setPageItem(i)
        }

        // 2nd - loop thru selected range
        let selectedRangeLow = 0
        if (this.selected - halfPageRange > 0) {
          selectedRangeLow = this.selected - 1 - halfPageRange
        }

        let selectedRangeHigh = selectedRangeLow + this.pageRange - 1
        if (selectedRangeHigh >= this.pageCount) {
          selectedRangeHigh = this.pageCount - 1
          selectedRangeLow = selectedRangeHigh - this.pageRange + 1
        }

        for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++) {
          setPageItem(i)
        }

        // Check if there is breakView in the left of selected range
        if (selectedRangeLow > this.marginPages) {
          setBreakView(selectedRangeLow - 1)
        }

        // Check if there is breakView in the right of selected range
        if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
          setBreakView(selectedRangeHigh + 1)
        }

        // 3rd - loop thru high end of margin pages
        for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--) {
          setPageItem(i)
        }
      }

      return items
    },

    firstPageSelected() {
      return this.selected === 1
    },

    lastPageSelected() {
      return (this.selected === this.pageCount) || (this.pageCount === 0)
    },

    firstItemInPage() {
      return ((this.value - 1) * this.perPage) + 1
    },

    lastItemInPage() {
      let lastItemCount =
        this.value * this.perPage <= this.totalItem
        ? this.value * this.perPage
        : this.totalItem

      return lastItemCount
    }
  },

  methods: {
    handlePageSelected(selected) {
      if (this.selected === selected) return

      this.innerValue = selected
      this.$emit('update:value', selected)
      this.clickHandler(selected)
    },

    prevPage() {
      if (this.selected <= 1) return
      this.handlePageSelected(this.selected - 1)
    },

    nextPage() {
      if (this.selected >= this.pageCount) return
      this.handlePageSelected(this.selected + 1)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.pagination-wrapper {
  @include flexbox(flex-start, center);
}

.pagination__shower {
  font-size: 12px;
  line-height: 18px;
  color: $color-grey-55;
  margin-right: 16px;
}

.pagination {
  @include flexbox(flex-start, center);

  &__link {
    @include flexbox(center, center);
    outline: 0;
    padding: 4px 7px;
    min-width: 24px;
    height: 24px;
    line-height: -1;
    font-size: 14px;
    border-radius: 4px;
    color: $color-grey-55;
    border: 1px solid $color-grey-55;
    cursor: pointer;

    &--break {
      border: 0;
    }

    &--icon {
      padding: 0;
      border: 0;
      padding-bottom: 1px;
    }
  }

  &__item {
    &.active,
    &:hover:not(.disabled) {
      .pagination__link {
        color: $color-grey-100;
        background-color: $color-grey-55;
      }
    }
  }

  &__item + &__item {
    margin-left: 4px;
  }

  &__break .pagination__link {
    cursor: default;
  }

  &__prev,
  &__next {
    &.disabled .pagination__link {
      color: $color-grey-100;
      cursor: not-allowed;
    }

    &.disabled .pagination__link.pagination__link--icon {
      color: $color-grey-55;
    }
  }
}
</style>
