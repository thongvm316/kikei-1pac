<template>
  <a-modal v-model:visible="visible" :title="$t('company.title_search')" class="search" width="800px">
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- Keyword -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('company.keyword') }}</label>
            <div class="form-input">
              <a-input v-model:value="filter.key_search" :placeholder="$t('common.please_enter')" />
              <span class="note" v-text="`※` + $t('company.note')" />
            </div>
          </div>
        </div>

        <!-- Classification -->
        <div class="form-group">
          <div class="form-content">
            <label class="label-input">
              {{ $t('company.classification') }}
            </label>
            <a-checkbox-group v-model:value="filter.division">
              <a-checkbox v-for="item in DIVISION" :key="item.id" :value="item.id">{{
                $t(`company.${item.value}`)
              }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- Country -->
        <div class="form-group">
          <div class="form-content">
            <label class="label-input">
              {{ $t('company.country') }}
            </label>
            <a-checkbox-group v-model:value="filter.country_id">
              <a-checkbox v-for="item in COUNTRY" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <!-- Currency -->
        <div class="form-group">
          <div class="form-content">
            <label class="label-input">
              {{ $t('company.currency') }}
            </label>
            <a-checkbox-group v-model:value="filter.currency_id">
              <a-checkbox v-for="item in CURRENCY" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <a-button key="back" class="btn-close" @click="handleClear">{{ $t('company.clear') }}</a-button>
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
import { defineComponent, reactive, computed, watch, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { DIVISION, COUNTRY, CURRENCY } from '@/enums/company.enum'
import { isEqual, keys, isArray, map, forEach, includes } from 'lodash-es'

export default defineComponent({
  name: 'CompanySearchForm',

  components: { SearchIcon },

  props: {
    isDelete: {
      type: Boolean,
      required: true
    }
  },

  emits: ['filter-changed'],

  setup(props, context) {
    const store = useStore()
    const route = useRoute()

    const { isDelete } = toRefs(props)

    const initialState = {
      key_search: '',
      division: [],
      country_id: [],
      currency_id: []
    }

    let filter = reactive({ ...initialState })

    watch(isDelete, (value) => {
      if (value) {
        handleClear()
        onSearch()
        store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqual(filter, initialState))
      }
    })

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
        division: filter.division,
        country_id: filter.country_id,
        currency_id: filter.currency_id
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
      DIVISION,
      COUNTRY,
      CURRENCY
    }
  }
})
</script>
