<template>
  <a-modal
    v-model:visible="visible"
    :title="$t('account.title_search')"
    class="search-account"
    width="800px"
    @cancel="handleModalCancel"
  >
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- Keyword -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('account.keyword') }}</label>
            <div class="form-input">
              <a-input v-model:value="filter.key_search" :placeholder="$t('common.please_enter')" />
              <span class="note" v-text="`※` + $t('account.note')" />
            </div>
          </div>
        </div>

        <a-button key="back" @click="handleClear">{{ $t('account.clear') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('company.search') }}
        </a-button>
      </form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { isEqual } from 'lodash-es'

export default defineComponent({
  name: 'AccountSearchForm',

  components: { SearchIcon },

  emits: ['filter-changed'],

  setup(props, context) {
    const store = useStore()
    const route = useRoute()

    const isNeedSubmit = ref(false)

    const initialState = {
      key_search: ''
    }

    const filter = reactive({ ...initialState })

    const visible = computed({
      get: () => store.state.search.currentRoute === route.name,
      set: (val) => {
        store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
      }
    })

    const handleClear = () => {
      isNeedSubmit.value = !isEqual(filter, initialState)
      Object.assign(filter, initialState)
    }

    const onSearch = () => {
      const data = {
        key_search: filter.key_search
      }
      context.emit('filter-changed', data)
      visible.value = false
      isNeedSubmit.value = false
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqual(filter, initialState))
    }

    const handleModalCancel = () => {
      isNeedSubmit.value && onSearch()
    }

    return {
      visible,
      filter,
      handleClear,
      onSearch,
      handleModalCancel
    }
  }
})
</script>
