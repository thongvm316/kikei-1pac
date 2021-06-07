<template>
  <a-modal v-model:visible="visible" :title="$t('company.title_search')" class="search-company" width="800px">
    <template #footer>
      <form @submit.prevent="onSearch">
        <!-- Keyword -->
        <div class="form-group">
          <div class="form-content">
            <label class="form-label">{{ $t('company.keyword') }}</label>
            <div class="form-input">
              <a-input v-model:value="filter.key_search" class="w-339" :placeholder="$t('common.please_enter')" />
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
              <a-checkbox v-for="item in DIVISION" :key="item.id" :value="item.id">{{ item.value }}</a-checkbox>
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
import { defineComponent, reactive, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SearchIcon from '@/assets/icons/ico_search.svg'
import { DIVISION, COUNTRY, CURRENCY } from '@/enums/company.enum'

export default defineComponent({
  name: 'Search',

  components: { SearchIcon },

  emits: ['filter-changed'],

  setup(props, context) {
    const store = useStore()
    const route = useRoute()
    const filter = reactive({ key_search: '', division: [], country_id: [], currency_id: [] })
    const visible = computed({
      get: () => store.getters.currentRoute === route.name,
      set: (val) => {
        store.commit('setCurrentRoute', val)
      }
    })

    const headline = ref(null)

    onMounted(() => {
      console.log(headline.value.textContent)
    })

    const handleCancel = () => {
      visible.value = false
    }

    const onSearch = () => {
      context.emit('filter-changed', filter)
      handleCancel()
    }

    return {
      headline,
      visible,
      DIVISION,
      COUNTRY,
      CURRENCY,
      filter,
      handleCancel,
      onSearch
    }
  }
})
</script>
