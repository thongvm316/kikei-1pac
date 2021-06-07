<template>
  <a-modal v-model:visible="visible" :title="$t('financing.title_search')" class="search-financing" width="800px">
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- Group -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('financing.group') }}</label>

            <div class="form-select">
              <a-select
                v-model:value="filter.groups_value"
                :placeholder="$t('financing.group_placeholder')"
                style="width: 152px"
                @change="handleChange"
              >
                <a-select-option v-for="item in filter.groups_value" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
        <!--./Group -->
        <!--Stages-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('financing.stages') }}</label>

            <div class="form-select">
              <a-select v-model:value="filter.stages_value" placeholder="" style="width: 80px" @change="handleChange">
                <a-select-option v-for="item in filter.stages_value" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
              <span style="margin-left: 4px">{{ $t('financing.term') }}</span>
            </div>
          </div>
        </div>
        <!--./Stages -->
        <!--Date From-->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label"></label>

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
        <!-- Display -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('financing.display') }}</label>

            <div class="form-checkbox">
              <a-radio-group v-model:value="filter.display" @change="handleChange">
                <a-radio v-for="item in DISPLAY" :key="item.id" :value="item.id">
                  {{ $t(`financing.${item.value}`) }}
                </a-radio>
              </a-radio-group>
            </div>
          </div>
        </div>
        <!-- ./Display -->

        <a-button key="back" @click="handleCancel">{{ $t('financing.handle_cancel') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit" :loading="loading">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('financing.handle_ok') }}
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

import { DISPLAY } from '@/enums/financing.enum'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'Search',

  components: { SearchIcon, CalendarOutlined },

  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const { t } = useI18n()

    const loading = ref(false)

    const filter = reactive({ groups_value: [], stages_value: [], date: [], display: [] })
    // const dataGroups = reactive(['tomato', 'orange', 'carrot'])
    // const dataStages = reactive(['One', 'Two', 'Three'])

    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    const handleCancel = () => {
      visible.value = false
    }

    const onSearch = () => {
      context.emit('filter-changed', filter)
      handleCancel()
    }

    return {
      loading,
      visible,
      t,
      handleCancel,
      onSearch,
      filter,
      DISPLAY
    }
  }
})
</script>
<style scoped lang="scss"></style>
