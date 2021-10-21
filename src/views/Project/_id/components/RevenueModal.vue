<template>
  <a-modal
    v-model:visible="visible"
    class="revenue-modal"
    width="85%"
    title="受注金額（見積・請求）"
    @cancel="handleCancel"
  >
    <template #footer>
      <div class="revenue-modal__wrapper">
        <div class="u-flex u-justify-between u-items-center">
          <div class="u-relative">
            <a-tooltip color="fff" title="Check all">
              <a-checkbox />
            </a-tooltip>

            <div class="revenue-modal__delete-btn">
              <a-tooltip color="fff" title="削除">
                <a-button type="primary" shape="circle">
                  <template #icon>
                    <span class="btn-icon"><DeleteWhiteIcon /></span>
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </div>
          <a-button type="primary"> 見積書発行 </a-button>
        </div>

        <div class="u-mt-16">
          <a-tabs v-model:activeKey="activeKey" :animated="false">
            <a-tab-pane v-for="tab in PROJECT_REVENUE_TYPES" :key="tab.key" :tab="tab.text">
              <div class="revenue-modal__filter">
                <div>
                  <a-month-picker :style="{ width: '122px' }" class="u-my-12" format="YYYY/MM" placeholder="YYYY/MM">
                    <template #suffixIcon>
                      <calendar-outlined />
                    </template>
                  </a-month-picker>
                </div>

                <a-space :size="32">
                  <a-button v-if="activeKey === PROJECT_REVENUE_TYPES[1].key" class="cost-tabs-clone">
                    <template #icon>
                      <span class="btn-icon"><copy-icon /></span>
                    </template>
                    予測の内容をコピー
                  </a-button>
                  <a-space>
                    <span>通貨</span>
                    <a-select
                      :value="1"
                      show-arrow
                      option-label-prop="label"
                      class="u-ml-8"
                      :style="{ width: '80px' }"
                      :default-active-first-option="false"
                    >
                      <a-select-option
                        v-for="currency in currencyList"
                        :key="currency.id"
                        :value="currency.id"
                        :label="currency.code"
                      >
                        {{ currency.code }}
                      </a-select-option>
                    </a-select>
                  </a-space>
                </a-space>
              </div>

              <a-spin :spinning="false">
                <table class="revenue-modal__table">
                  <thead>
                    <tr>
                      <th style="min-width: 300px">科目</th>
                      <th style="min-width: 206px">費目</th>
                      <th style="min-width: 302px">概要・備考</th>
                      <th style="min-width: 200px">単価</th>
                      <th style="min-width: 300px">数量</th>
                      <th style="width: 100%">小計</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>
                        <a-space>
                          <a-checkbox />

                          <a-select
                            :value="1"
                            show-arrow
                            option-label-prop="label"
                            class="u-ml-8"
                            :style="{ width: '154px' }"
                            :default-active-first-option="false"
                          >
                            <a-select-option
                              v-for="currency in currencyList"
                              :key="currency.id"
                              :value="currency.id"
                              :label="currency.code"
                            >
                              {{ currency.code }}
                            </a-select-option>
                          </a-select>
                        </a-space>
                      </td>
                      <td>
                        <a-select
                          :value="1"
                          show-arrow
                          option-label-prop="label"
                          class="u-ml-8"
                          :style="{ width: '154px' }"
                          :default-active-first-option="false"
                        >
                          <a-select-option
                            v-for="currency in currencyList"
                            :key="currency.id"
                            :value="currency.id"
                            :label="currency.code"
                          >
                            {{ currency.code }}
                          </a-select-option>
                        </a-select>
                      </td>
                      <td>
                        <a-input placeholder="概要・備考" />
                      </td>
                      <td>
                        <a-space v-if="true">
                          <EditLargeIcon style="cursor: pointer" />
                          <span>999,999,999</span>
                        </a-space>
                        <a-input-number
                          v-else
                          placeholder="0"
                          :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                          :precision="0"
                          :min="0"
                          :max="999999999999"
                        />
                      </td>
                      <td>
                        <a-space>
                          <a-input-number
                            placeholder="0"
                            :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            :precision="0"
                            :min="0"
                            :max="999999999999"
                          />

                          <a-select
                            :value="1"
                            show-arrow
                            option-label-prop="label"
                            class="u-ml-8"
                            :style="{ width: '154px' }"
                            :default-active-first-option="false"
                          >
                            <a-select-option
                              v-for="currency in currencyList"
                              :key="currency.id"
                              :value="currency.id"
                              :label="currency.code"
                            >
                              {{ currency.code }}
                            </a-select-option>
                          </a-select>
                        </a-space>
                      </td>
                      <td>999,999,999</td>
                    </tr>
                  </tbody>
                </table>
              </a-spin>
            </a-tab-pane>
          </a-tabs>
          <a-button size="small" class="u-mt-24">
            <template #icon>
              <span class="btn-icon"><line-add-icon /></span>
            </template>
            見積項目を追加
          </a-button>

          <div class="u-text-right u-mt-28">
            <a-select value="nghia" show-arrow class="u-ml-8" :default-active-first-option="false">
              <a-select-option value="nghia">消費税: 10%</a-select-option>
            </a-select>
          </div>

          <div class="revenue-modal__count">
            <p>合計: 999,999,999,999,999 (VND)</p>
            <p>合計（税込): 999,999,999,999,999 (VND)</p>
          </div>

          <div class="revenue-modal__extra-info">
            <div class="revenue-modal__extra-info--left">
              <table>
                <tbody>
                  <tr>
                    <td>備考 / メモ</td>
                    <td>
                      <a-textarea style="width: 356px" placeholder="入力してください" allow-clear />
                    </td>
                  </tr>
                  <tr>
                    <td>請求元</td>
                    <td>
                      <a-input style="width: 356px" placeholder="会社名（デフォルトで入力済み・変更可）" />
                    </td>
                  </tr>
                  <tr>
                    <td>件名</td>
                    <td>
                      <a-input style="width: 356px" placeholder="件名（デフォルトで入力済み・変更可）" />
                    </td>
                  </tr>
                  <tr>
                    <td>見積作成日</td>
                    <td>
                      <a-month-picker :style="{ width: '147px' }" format="YYYY/MM" placeholder="YYYY/MM">
                        <template #suffixIcon>
                          <calendar-outlined />
                        </template>
                      </a-month-picker>
                    </td>
                  </tr>
                  <tr>
                    <td>納品期日</td>
                    <td>
                      <a-month-picker :style="{ width: '147px' }" format="YYYY/MM" placeholder="YYYY/MM">
                        <template #suffixIcon>
                          <calendar-outlined />
                        </template>
                      </a-month-picker>
                    </td>
                  </tr>
                  <tr>
                    <td>見積書の有効期間</td>
                    <td>
                      <a-space>
                        <a-radio-group :value="1">
                          <a-radio :value="1">1ヶ月</a-radio>
                          <a-radio :value="2">3ヶ月</a-radio>
                          <a-radio :value="3">6ヶ月</a-radio>
                          <a-radio :value="4">1年</a-radio>
                          <a-radio :value="5">1年</a-radio>
                        </a-radio-group>
                        <a-input style="width: 216px" placeholder="入力してください" />
                      </a-space>
                    </td>
                  </tr>

                  <tr>
                    <td>支払条件</td>
                    <td>
                      <a-radio-group :value="1">
                        <a-radio :value="1">銀行振込</a-radio>
                        <a-radio :value="2">現金</a-radio>
                        <a-radio :value="3">小切手または手形</a-radio>
                        <a-radio :value="4">貴社支払規定による</a-radio>
                      </a-radio-group>
                    </td>
                  </tr>

                  <tr>
                    <td>担当者</td>
                    <td>
                      <a-select style="width: 356px" value="nghia" show-arrow :default-active-first-option="false">
                        <a-select-option value="nghia">担当者名（デフォルトで選択済み・変更可）</a-select-option>
                      </a-select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="revenue-modal__extra-info--right">
              <div class="history-download">
                <p class="history-download__head">出力済み見積書</p>

                <div class="history-download__body">
                  <div class="history-download__item">
                    <strong>2021/10/01 - 07:45</strong>
                    <p>YYYYMMDD_GXX-YYYY-ZZZ.pdf</p>
                  </div>
                  <div class="history-download__item">
                    <strong>2021/10/01 - 07:45</strong>
                    <p>YYYYMMDD_GXX-YYYY-ZZZ.pdf</p>
                  </div>
                  <div class="history-download__item">
                    <strong>2021/10/01 - 07:45</strong>
                    <p>YYYYMMDD_GXX-YYYY-ZZZ.pdf</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="revenue-modal__submit-buttons">
            <a-button @click="handleCancel">キャンセル</a-button>
            <a-button :loading="isLoaddingSubmitButton" type="primary" class="u-ml-8" @click="submit">登録</a-button>
          </div>
        </div>
      </div>
    </template>
  </a-modal>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import DeleteWhiteIcon from '@/assets/icons/ico_delete_white.svg'
import { PROJECT_REVENUE_TYPES, PROJECT_TYPES } from '@/enums/project.enum'
import { getCurrencyList } from '../../composables/useCurrency'
import CopyIcon from '@/assets/icons/ico_copy.svg'
import { CalendarOutlined } from '@ant-design/icons-vue'
import EditLargeIcon from '@/assets/icons/ico_edit_large.svg'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'

export default defineComponent({
  name: 'RevenueModal',

  components: {
    DeleteWhiteIcon,
    CopyIcon,
    CalendarOutlined,
    EditLargeIcon,
    LineAddIcon
  },

  emits: ['update:visible'],

  setup(_, { emit }) {
    const visible = ref()
    const activeKey = ref('1')
    const currencyList = ref([])

    const handleCancel = () => emit('update:visible', false)

    onBeforeMount(async () => {
      // get currency list
      const currencyReponse = await getCurrencyList()
      currencyList.value = currencyReponse?.result?.data || []
    })

    return {
      visible,
      activeKey,
      PROJECT_REVENUE_TYPES,
      PROJECT_TYPES,
      currencyList,

      handleCancel
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

.revenue-modal {
  .ant-modal-footer {
    background-color: $color-grey-96;
    max-height: 80vh;
    overflow-y: scroll;
  }

  &__wrapper {
    text-align: left;
  }

  &__delete-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
  }

  &__filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__count {
    text-align: right;
    margin: 24px 0;
    padding: 12px 0;
    border-top: 1px dashed $color-grey-85;
    border-bottom: 1px dashed $color-grey-85;

    p {
      margin-bottom: 0;
    }
  }

  &__table {
    border: 1px solid $color-grey-75;
    overflow: auto;
    display: block;
    max-height: 505px;

    thead {
      background-color: $color-grey-92;
      color: $color-primary-9;
      font-weight: 700;
      font-size: 12px;
      position: sticky;
      top: 0;
      z-index: 100;

      th {
        border-bottom: 1px solid $color-grey-75;
        width: 200px;
      }
    }

    th,
    td {
      white-space: nowrap;
      padding: 16px;
      border-right: 1px solid $color-grey-75;

      &:last-child {
        border-right: none;
      }
    }

    tbody {
      background-color: $color-grey-100;

      td {
        border-bottom: 1px solid $color-grey-75;
      }
    }
  }

  &__extra-info {
    display: flex;
    gap: 52px;
    overflow-x: auto;

    &--left {
      flex-basis: 60%;

      table {
        width: 100%;

        td {
          padding: 12px;
          white-space: nowrap;
          vertical-align: top;
        }
      }
    }

    &--right {
      flex-basis: 40%;
      min-width: 335px;
    }
  }

  &__submit-buttons {
    text-align: center;
    margin-top: 24px;
    margin-bottom: 16px;
  }

  .cost-tabs-clone {
    border: 0;
    color: $color-primary-6;
    background-color: $color-grey-96;

    &:hover:not(.ant-btn[disabled]) {
      span {
        text-decoration: underline;
      }
    }
  }

  .cost-tabs-clone.ant-btn[disabled] {
    color: $color-grey-55;
    background-color: $color-grey-96;
  }

  .history-download {
    margin-top: 12px;
    border: 1px solid $color-grey-85;
    height: auto;

    p {
      margin-bottom: 0;
    }

    &__head {
      background-color: $color-grey-92;
      padding: 12px 12px 12px 32px;
      font-size: 16px;
      font-weight: 700;
      color: $color-grey-15;
    }

    &__body {
      background-color: $color-grey-94;
      padding: 0 32px;
    }

    &__item {
      padding: 16px 0 16px 0;
      font-size: 12px;

      p {
        color: $color-primary-6;
      }

      & + .history-download__item {
        border-top: 1px dashed $color-grey-85;
      }
    }
  }
}
</style>
