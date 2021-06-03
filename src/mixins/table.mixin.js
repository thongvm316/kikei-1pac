import { uniqueId } from 'lodash-es'
import { LOCALE } from '@/enums/locale.enum'

export default {
  methods: {
    buildOptionText(pageSize) {
      if (this.$i18n.locale === LOCALE.vi) {
        return `${pageSize.value} / ページ`
      }
      return `${pageSize.value} / page`
    },

    showTotal(total, range) {
      console.log('test')
      if (this.$i18n.locale === LOCALE.ja) {
        return `${range[0]} - ${range[1]} 件 / 総件数 ${total}件`
      }
      return `${range[0]}-${range[1]} of ${total} items`
    },

    randomUniqueID() {
      return uniqueId('row_')
    }
  }
}
