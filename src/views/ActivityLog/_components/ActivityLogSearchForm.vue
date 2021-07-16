<template>
  <a-modal v-model:visible="visible" :title="$t('logs.title_search')" class="search-activity-log" width="800px">
    <template #footer>
      <form @submit.prevent="onSubmit">
        <!--Date From-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('logs.stages') }}</label>

            <div class="form-select">
              <a-range-picker
                v-model:value="dateRange"
                :show-time="{ format: 'HH:mm:ss' }"
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="['YYYY/MM/DD HH:MM:SS', 'YYYY/MM/DD HH:MM:SS']"
                @change="onChange"
              >
              </a-range-picker>
            </div>
          </div>
        </div>
        <!--./Date From -->
        <a-button key="clear" class="btn-close" @click="handleClear">{{ $t('logs.handle_cancel') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit" :loading="loading">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('logs.handle_ok') }}
        </a-button>
      </form>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isEqual } from 'lodash-es'

import SearchIcon from '@/assets/icons/ico_search.svg'

const state = {
  from: '',
  to: ''
}

export default defineComponent({
  name: 'Search',

  components: { SearchIcon },

  emits: ['filter-changed'],

  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()

    const filter = ref({})
    const dateRange = ref([])
    const loading = ref(false)

    filter.value = { ...state }

    const visible = computed({
      get: () => store.state.search.currentRoute === route.name,
      set: (val) => {
        store.commit('search/STORE_SEARCH_CURRENT_ROUTE', val)
      }
    })

    const handleOk = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        visible.value = false
      }, 2000)
    }

    const onChange = (value) => {
      if (value.length) {
        filter.value = {
          from: value[0].format(),
          to: value[1].format()
        }
      }
    }

    const handleClear = () => {
      filter.value = { ...state }
      dateRange.value = []
    }

    const onSubmit = () => {
      const data = {
        from: filter.value.from,
        to: filter.value.to
      }
      context.emit('filter-changed', data)
      visible.value = false
      store.commit('search/STORE_SEARCH_SHOW_BADGE', !isEqual(filter.value, state))
    }

    return {
      loading,
      visible,
      t,
      dateRange,
      handleOk,
      handleClear,
      onSubmit,
      onChange
    }
  }
})
</script>
<style scoped lang="scss"></style>
