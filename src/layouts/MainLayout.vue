<template>
  <a-layout class="main">
    <app-sidebar @on-collapse-side-bar="onCollapseSideBar($event)"/>
    <a-layout class="main__content">
      <app-header :class="isCollapse ? 'is-collapse' : ''">
        <slot name="header" />
      </app-header>

      <a-layout-content class="u-pt-56">
        <a-config-provider :locale="locales[locale]">
          <router-view />
        </a-config-provider>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import AppSidebar from './-components/AppSidebar'
import AppHeader from './-components/AppHeader'
import localeEn from 'ant-design-vue/es/locale/en_US'
import localeJa from 'ant-design-vue/es/locale/ja_JP'

export default defineComponent({
  name: 'MainLayout',

  components: {
    AppSidebar,
    AppHeader
  },

  setup() {
    const locales = ref({ en: localeEn, ja: localeJa })
    const { locale } = useI18n()
    const isCollapse = ref()

    const onCollapseSideBar = (isCollapseEmit) => {
      isCollapse.value = isCollapseEmit
    }

    onMounted(() => {
      locales.value = {
        en: { ...locales.value.en, Empty: { description: 'The corresponding item was not found.' } },
        ja: { ...locales.value.ja, Empty: { description: '該当する企業が見つかりませんでした。' } }
      }
    })

    return {
      locale,
      locales,
      isCollapse,
      onCollapseSideBar
    }
  }
})
</script>

<style lang="scss">
.header.is-collapse {
  left: 66px;
  transition: transform 0.3s ease-in-out, left 0.3s ease-in-out;
}

.main {
  height: 100vh;
}
</style>
