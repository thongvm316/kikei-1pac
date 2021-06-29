<template>
  <a-modal v-model:visible="visible" :title="$t('subcategory.title_search')" class="search" width="800px">
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- category_name -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('subcategory.category') }}</label>
            <label class="form-input">{{filter.category_name}}</label>
          </div>
        </div>

        <!-- Keyword -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('subcategory.keyword') }}</label>
            <div class="form-input">
              <a-input v-model:value="filter.key_search" :placeholder="$t('common.please_enter')" />
              <span class="note" v-text="`※` + $t('subcategory.note')" />
            </div>
          </div>
        </div>

        <a-button key="back" @click="handleClear">{{ $t('subcategory.clear') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('subcategory.search') }}
        </a-button>
      </form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { filter, isEqual } from 'lodash-es'

export default defineComponent({
  name: 'SubcategorySearchForm',

  props: {
    filter: Object
  },

  components: { SearchIcon },

  emits: ['filter-changed'],

  setup(props, context) {
    const store = useStore()
    const route = useRoute()

    const initialState = {
      key_search: '',
      category_id: props.filter.category_id,
      category_name: props.filter.category_name
    }

    const filter = reactive({ ...initialState })

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    const handleClear = () => {
      Object.assign(filter, initialState) && onSearch()
    }

    const onSearch = () => {
      const data = {
        category_id: filter.category_id,
        key_search: filter.key_search
      }
      console.log(data)
      context.emit('filter-changed', data)
      visible.value = false
      store.commit('setIsShowSearchBadge', !isEqual(filter, initialState))
    }

    return {
      visible,
      filter,
      handleClear,
      onSearch,
    }
  }
})
</script>
