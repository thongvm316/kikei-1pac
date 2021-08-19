<template>
  <a-select ref="select" v-model:value="locales" style="width: 115px" @change="handleChange">
    <a-select-option v-for="(item, i) in LANGUAGE" :key="i" :value="item.locale">
      <span class="role">
        <div class="role__flag">
          <component :is="item.component" class="role__flag-img" />
        </div>
        {{ item.value }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { LANGUAGE } from '@/enums/language.enum'

import JapanIcon from '@/assets/icons/ico_japan.svg'
import UsaIcon from '@/assets/icons/ico_united-kingdom.svg'

export default defineComponent({
  name: 'ChangeLanguage',

  components: {
    JapanIcon,
    UsaIcon
  },

  setup() {
    const t = useI18n()
    const store = useStore()

    const locales = ref('')

    onMounted(() => {
      locales.value = store.state.lang.language
    })

    const handleChange = (value) => {
      t.locale.value = value
      store.commit('lang/STORE_LANGUAGE', value)
    }

    return {
      locales,
      LANGUAGE,
      store,
      handleChange
    }
  }
})
</script>

<style scoped lang="scss">
.role {
  display: inline-flex;

  &__flag {
    display: flex;
    width: 25%;
    margin-right: 10px;
  }

  &__flag-img {
    width: 100%;
  }
}
</style>
