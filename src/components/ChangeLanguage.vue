<template>
  <a-select ref="select" v-model:value="locales.ja" style="width: 115px" @change="handleChange">
    <a-select-option v-for="(locale, i) in locales" :key="i" :value="locale">
      <span class="role">
        <div v-if="i === 'ja'" class="role__flag">
          <japan-icon class="role__flag-img" />
        </div>
        <div v-else class="role__flag">
          <usa-icon class="role__flag-img" />
        </div>
        {{ locale }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { forEach } from 'lodash-es'
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

    const selected = ref()

    const locales = {
      en: 'English',
      ja: '日本語'
    }

    const handleChange = (value, key) => {
      selected.value = key.key
      forEach(t.availableLocales, (value) => {
        if (value === selected.value) return (t.locale.value = value)
      })
    }

    return {
      locales,
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
