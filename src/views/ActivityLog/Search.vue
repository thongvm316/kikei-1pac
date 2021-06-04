<template>
  <a-modal v-model:visible="visible" :title="$t('logs.title_search')" class="search-activity-log" width="800px">
    <template #footer>
      <form @submit.prevent="onSubmit">
        <!--Date From-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('logs.stages') }}</label>

            <div class="form-select">
              <a-range-picker style="width: 300px" format="YYYY-MM" :placeholder="['YYYY/MM', 'YYYY/MM']">
                <template #suffixIcon>
                  <CalendarOutlined />
                </template>
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
import { defineComponent, ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Search',

  components: { SearchIcon, CalendarOutlined },

  setup() {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()

    const loading = ref(false)

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    function handleOk() {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        visible.value = false
      }, 2000)
    }

    function handleCancel() {
      visible.value = false
    }

    function onSubmit() {
      alert('ok')
    }

    function handleChange() {
      console.log('aa')
    }

    return {
      loading,
      visible,
      handleOk,
      handleCancel,
      onSubmit,
      handleChange
    }
  }
})
</script>
<style scoped lang="scss"></style>
