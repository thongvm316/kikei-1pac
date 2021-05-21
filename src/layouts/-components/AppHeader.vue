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
import { defineComponent } from 'vue'
import KButton from '@/components/KButton'
import KBreadcrumb from '@/components/KBreadcrumb'
import AvatarIcon from '@/assets/icons/ico_avatar.svg'

export default defineComponent({
  name: 'AppHeader',

  components: {
    KButton,
    KBreadcrumb,
    AvatarIcon
  }
})
</script>
