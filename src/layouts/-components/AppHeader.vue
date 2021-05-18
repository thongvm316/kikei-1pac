<template>
  <header class="header">
    <div class="container">
      <div class="header__breadcrumb">
        <k-breadcrumb />
      </div>
      <div class="header__content">
        <slot />
      </div>
      <div class="header__account u-pl-24">
        <k-button class="header__account--profile">
          <avatar-icon />
        </k-button>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'

const KButton = defineAsyncComponent(() => import('@/components/KButton'))
const KBreadcrumb = defineAsyncComponent(() => import('@/components/KBreadcrumb'))

import AvatarIcon from '@/assets/ico_avatar.svg'

export default defineComponent({
  name: 'AppHeader',

  components: {
    KButton,
    KBreadcrumb,
    AvatarIcon
  }
})
</script>
