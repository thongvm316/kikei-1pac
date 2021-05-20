<template>
  <component :is="icon" />
</template>

<script>
import { defineComponent, defineAsyncComponent, onMounted, watch, ref } from 'vue'

export default defineComponent({
  name: 'KIcon',

  props: {
    iconName: {
      type: String,
      require: true
    }
  },

  setup(props) {
    const iconName = props.iconName
    let icon = ref('')
    const asyncIcon = () => {
      icon = () => defineAsyncComponent(import(`@/assets/icons/${iconName}.svg?vue`))
    }

    onMounted(asyncIcon)

    watch(iconName, asyncIcon)


    return {
      icon
    }
  }
})
</script>
