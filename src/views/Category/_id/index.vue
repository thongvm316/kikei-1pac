<template>
  <category-form />
</template>

<script>
import { defineComponent } from 'vue'
import CategoryForm from '@/views/Category/-components/CategoryForm'
import useGetCategoryDetailService from '@/views/Category/composables/useGetCategoryDetailService'

export default defineComponent({
  name: 'CategoryEditPage',

  components: { CategoryForm },

  async beforeRouteEnter(to, from, next) {
    const { categoryDetail } = useGetCategoryDetailService(to.params.id)
    const resp = await categoryDetail()

    to.meta['detail'] = resp.result.data

    next()
  }
})
</script>
