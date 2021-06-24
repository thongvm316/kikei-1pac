<template>
  <category-form />
</template>

<script>
import { defineComponent } from 'vue'
import useGetSubcategoryDetailService from '@/views/Subcategory/composables/useGetSubcategoryDetaillService'

export default defineComponent({
  name: 'SubcategoryEditPage',

  components: { },

  async beforeRouteEnter(to, from, next) {
    const { subcategoryDetail } = useGetSubcategoryDetailService(to.params.id)
    const resp = await subcategoryDetail()

    to.meta['detail'] = resp.result.data
    console.log(resp.result.data)

    next()
  }
})
</script>
