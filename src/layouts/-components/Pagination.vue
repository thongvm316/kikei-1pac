<template>
  <section>
    <a-pagination
      v-model:current="page"
      :total="101"
      :show-total="(total, range) => `${range[0]}-${range[1]} / ${total}件`"
      :page-size="10"
      size="small"
    />
  </section>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Pagination',

  setup() {
    const page = ref(3)

    return {
      page
    }
  }
})
</script>

<style scoped></style>
