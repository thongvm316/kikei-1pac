<template>
  <a-modal v-model:visible="visible" :title="$t('company.title_search')" class="search-company" width="800px">
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- Keyword -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('company.keyword') }}</label>
            <div class="form-input">
              <a-input v-model:value="filter.key_search" class="w-339" :placeholder="$t('company.place_input')" />
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
            <a-checkbox-group v-model:value="filter.divition">
              <a-checkbox v-for="item in DIVITION" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
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
              <a-checkbox v-for="item in CURRENTCY" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
            </a-checkbox-group>
          </div>
        </div>

        <a-button key="back" @click="handleCancel">{{ $t('company.handle_cancel') }}</a-button>
        <a-button key="submit" type="primary" html-type="submit">
          <template #icon>
            <span class="btn-icon">
              <search-icon />
            </span>
          </template>
          {{ $t('company.handle_ok') }}
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
import { DIVITION, COUNTRY, CURRENTCY } from '@/enums/company.enum'

export default defineComponent({
  name: 'Search',

  components: { SearchIcon },

  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const filter = reactive({ key_search: '', divition: [], country_id: [], currency_id: [] })
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
      visible,
      DIVITION,
      COUNTRY,
      CURRENTCY,
      filter,
      handleCancel,
      onSearch
    }
  }
})
</script>
