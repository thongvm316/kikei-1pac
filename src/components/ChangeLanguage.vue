<template>
  <a-select v-model:value="locale" style="width: 115px" @focus="focus" @change="handleChange">
    <a-select-option v-for="(item, i) in LANGUAGE" :key="i" :value="item.locale">
      <span class="role">
        <div v-if="item.locale === 'ja'" class="role__flag">
          <img class="role__flag-img" src="@/assets/icons/ico_japan.png" alt="flag-japan" />
        </div>
        <div v-else class="role__flag">
          <img class="role__flag-img" src="@/assets/icons/ico_united-kingdom.png" alt="flag-japan" />
        </div>
        {{ item.value }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { LANGUAGE } from '@/enums/language.enum'

export default defineComponent({
  name: 'ChangeLanguage',

  setup() {
    const { locale } = useI18n()
    const store = useStore()

    const handleChange = (value) => {
      locale.value = value
    }

    return {
      locale,
      store,
      handleChange,
      LANGUAGE
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
    height: 20px;
    margin: auto;
    margin-right: 10px;
  }

  &__flag-img {
    width: 100%;
  }
}
</style>
