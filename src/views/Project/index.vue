<template>
  <table class="table">
    <thead>
      <tr>
        <th class="yyy">
          <span class="u-mr-8">更新日</span>

          <k-sort-icon />
        </th>
        <th>クライアント / プロジェクト名</th>
        <th>受注確度</th>
        <th>リリース日</th>
        <th>受注金額</th>
        <th>計上月</th>
        <th>グループ</th>
        <th>営業担当</th>
      </tr>
    </thead>
  </table>

  <p>Project Page</p>
  <router-link to="/project/edit">
    <k-button
      variant="primary"
      size="md"
    >
    Go to Edit page
    </k-button>
  </router-link>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
const KButton = defineAsyncComponent(() => import('@/components/KButton'))
const KSortIcon = defineAsyncComponent(() => import('@/components/KSortIcon'))

export default defineComponent({
  name: 'ProjectPage',

  components: {
    KButton,
    KSortIcon
  }
})
</script>

<style lang="scss" scoped>
.yyy {
  display: flex;
  align-items: center;
}
</style>
