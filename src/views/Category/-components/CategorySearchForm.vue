<template>
  <a-modal v-model:visible="visible" :title="$t('category.title_search')" class="search" width="800px">
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- DIVISIONCATEGORY -->
        <div class="form-group">
          <div class="form-content">
            <label class="label-input">
              {{ $t('category.category_division') }}
            </label>
            <a-checkbox-group v-model:value="filter.division_type">
              <a-checkbox v-for="item in DIVISIONCATEGORY" :key="item.id" :value="item.id">{{
                $t(`category.${item.value}`)
              }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- DIVISIONSUBCATEGORY -->
        <div class="form-group">
          <div class="form-content">
            <label class="label-input">
              {{ $t('category.subcategory_division') }}
            </label>
            <a-checkbox-group v-model:value="filter.subcategory_kind">
              <a-checkbox v-for="item in DIVISIONSUBCATEGORY" :key="item.id" :value="item.id">{{
                $t(`category.${item.value}`)
              }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- INUSE -->
        <div class="form-group">
          <div class="form-content">
            <label class="label-input">
              {{ $t('category.in_use') }}
            </label>
            <a-checkbox-group v-model:value="filter.in_use">
              <a-checkbox v-for="item in INUSE" :key="item.id" :value="item.boolean">{{
                $t(`category.${item.value}`)
              }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- Keyword -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('category.keyword') }}</label>
            <div class="form-input">
              <a-input v-model:value="filter.key_search" :placeholder="$t('common.please_enter')" />
              <span class="note" v-text="`※` + $t('category.note')" />
            </div>
          </div>
        </div>

        <a-button key="back" class="btn-close" @click="handleClear">{{ $t('category.clear') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('category.search') }}
        </a-button>
      </form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { DIVISIONCATEGORY, DIVISIONSUBCATEGORY, INUSE } from '@/enums/category.enum'
import { forEach, includes, isArray, isEqual, keys, map } from 'lodash-es'

export default defineComponent({
  name: 'CategorySearchForm',

  components: { SearchIcon },

  emits: ['filter-changed'],

  setup(props, context) {
    const store = useStore()
    const route = useRoute()

    const initialState = {
      key_search: '',
      division_type: [],
      subcategory_kind: [],
      in_use: []
    }

    let filter = reactive({ ...initialState })

    const visible = computed({
      get: () => store.state.search.currentRoute === route.name,
      set: (val) => {
        store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
      }
    })

    onMounted(() => {
      if (keys(route.query).length > 0) {
        forEach(route.query, (value, key) => {
          if (!includes(['order_by', 'page_number', 'page_size'], key)) {
            if (isArray(value)) {
              filter[key] = map([...value], (i) => Number(i))
            } else {
              filter[key] = value
            }
          }
        })
      }
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqual(filter, initialState))
    })

    const handleClear = () => {
      Object.assign(filter, initialState)
    }

    const onSearch = () => {
      const data = {
        key_search: filter.key_search,
        division_type: filter.division_type,
        subcategory_kind: filter.subcategory_kind,
        in_use: filter.in_use
      }
      context.emit('filter-changed', data)
      visible.value = false
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqual(filter, initialState))
    }

    return {
      visible,
      filter,
      handleClear,
      onSearch,
      DIVISIONCATEGORY,
      DIVISIONSUBCATEGORY,
      INUSE
    }
  }
})
</script>
