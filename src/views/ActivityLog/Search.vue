<template>
  <a-modal v-model:visible="visible" :title="$t('logs.title_search')" class="search-activity-log" width="800px">
    <template #footer>
      <form @submit.prevent="onSubmit">
        <!--Date From-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('logs.stages') }}</label>

            <div class="form-select">
              <a-range-picker format="YYYY-MM-DD" :placeholder="['YYYY/MM/DD', 'YYYY/MM/DD']" @change="onChange">
              </a-range-picker>
            </div>
          </div>
        </div>
        <!--./Date From -->
        <a-button key="back" @click="handleCancel">{{ $t('logs.handle_cancel') }}</a-button>
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

    const loading = ref(false)

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
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
      } else {
        filter.value = { ...state }
      }
    }

    const handleCancel = () => {
      visible.value = false
    }

    const onSubmit = () => {
      context.emit('filter-changed', filter.value)
      visible.value = false
    }

    return {
      loading,
      visible,
      t,
      handleOk,
      handleCancel,
      onSubmit,
      onChange
    }
  }
})
</script>
<style scoped lang="scss"></style>
