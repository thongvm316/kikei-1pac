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
        <div class="header__account--profile">
          <avatar-icon />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent } from 'vue'
import KBreadcrumb from '@/components/KBreadcrumb'
import AvatarIcon from '@/assets/icons/ico_avatar.svg'

export default defineComponent({
  name: 'AppHeader',

  components: {
    KBreadcrumb,
    AvatarIcon
  }
})
</script>
