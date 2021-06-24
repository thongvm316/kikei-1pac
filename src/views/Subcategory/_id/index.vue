<template>
  <subcategory-form />
</template>

<script>
import { defineComponent } from 'vue'
import useGetSubCategoryDetailService from '@/views/Subcategory/composables/useGetSubcategoryDetaillService'
import SubcategoryForm from '../-components/SubcategoryForm.vue'

export default defineComponent({
  name: 'SubcategoryEditPage',

  components: {SubcategoryForm },

  async beforeRouteEnter(to, from, next) {
    const { subCategoryDetail } = useGetSubCategoryDetailService(to.params.id)
    const resp = await subCategoryDetail()

    to.meta['detail'] = resp.result.data
    console.log(resp.result.data)

    next()
  }
})
</script>
