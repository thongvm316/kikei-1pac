<template>
  <div class="permission-table">
    <!-- table level 1 -->
    <table>
      <tbody>
        <tr>
          <td>Gumi Vietnam</td>
          <td><a-checkbox v-model:checked="checkedBox">アクセスを許可する</a-checkbox></td>
          <td>
            <div class="btn-dropdown" style="display:">
              <a-button
                size="small"
                type="link"
              >
                テンプレートを保存する
              </a-button>
              <span class="btn-icon"><ArrowDownIcon /></span>
            </div>
          </td>
        </tr>

        <tr>
          <td colspan="3"  style="display: ">
            <!-- table level 2 -->
            <table class="has-border">
              <thead>
                <tr>
                  <th></th>
                  <th>編集可</th>
                  <th>閲覧のみ</th>
                  <th>アクセス不可</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>プロジェクト</td>
                  <td>
                    <a-radio-group name="a" v-model:value="checked">
                      <a-radio :value="10"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="a" v-model:value="checked">
                      <a-radio :value="20"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="a" v-model:value="checked">
                      <a-radio :value="30"></a-radio>
                    </a-radio-group>
                  </td>
                </tr>
                <tr>
                  <td>入出金</td>
                  <td>
                    <a-radio-group name="b" v-model:value="checked">
                      <a-radio :value="10"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="b" v-model:value="checked">
                      <a-radio :value="20"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="b" v-model:value="checked">
                      <a-radio :value="30"></a-radio>
                    </a-radio-group>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="u-flex u-justify-end u-mt-12">
              <a-button
                size="small"
                type="link"
                class="btn-save"
              >
                <template #icon>
                  <span class="btn-icon"><save-icon /></span>
                </template>
                テンプレートを保存する
              </a-button>
            </div>
          </td>
        </tr>

        <tr>
          <td>VAND</td>
          <td><a-checkbox v-model:checked="checkedBox">アクセスを許可する</a-checkbox></td>
          <td style="display:">
            <div class="btn-dropdown">
              <a-button
                size="small"
                type="link"
              >
                テンプレートを保存する
              </a-button>
              <span class="btn-icon"><ArrowDownIcon /></span>
            </div>
          </td>
        </tr>

        <tr style="display:">
          <td colspan="3">
            <!-- table level 2 -->
            <table class="has-border">
              <thead>
                <tr>
                  <th></th>
                  <th>編集可</th>
                  <th>閲覧のみ</th>
                  <th>アクセス不可</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>プロジェクト</td>
                  <td>
                    <a-radio-group name="a" v-model:value="checked">
                      <a-radio :value="10"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="a" v-model:value="checked">
                      <a-radio :value="20"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="a" v-model:value="checked">
                      <a-radio :value="30"></a-radio>
                    </a-radio-group>
                  </td>
                </tr>
                <tr>
                  <td>入出金</td>
                  <td>
                    <a-radio-group name="b" v-model:value="checked">
                      <a-radio :value="10"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="b" v-model:value="checked">
                      <a-radio :value="20"></a-radio>
                    </a-radio-group>
                  </td>
                  <td>
                    <a-radio-group name="b" v-model:value="checked">
                      <a-radio :value="30"></a-radio>
                    </a-radio-group>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="u-flex u-justify-end u-mt-12">
              <a-button
                size="small"
                type="link"
                class="btn-save"
              >
                <template #icon>
                  <span class="btn-icon"><save-icon /></span>
                </template>
                テンプレートを保存する
              </a-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import SaveIcon from '@/assets/icons/ico_save.svg'
import ArrowDownIcon from '@/assets/icons/ico_arrow_down.svg'

export default defineComponent({
  name: 'PermissionTable',

  components: {
    SaveIcon,
    ArrowDownIcon
  },

  setup() {
    const checked = ref(10)
    const checkedBox = ref()

    return {
      checked,
      checkedBox
    }
  }
})
</script>

<style lang="scss">
@import '@/styles/shared/variables';

.permission-table {
  table {
    font-size: 14px;
    line-height: 22px;
    color: $color-grey-15;
    border: 1px solid $color-grey-75;
    min-width: 500px;
    background-color: $color-grey-100;

    tbody {
      tr td {
        &:first-child {
          width: 136px;
        }
      }
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid $color-grey-75;
    }

    &.has-border {
      font-size: 12px;
      line-height: 18px;

      thead {
        background-color: $color-grey-92;
        color: $color-primary-9;
        font-weight: 700;
        text-align: center;

        th:first-child {
          border-right: 1px solid $color-grey-75;
        }
      }

      tbody {
        tr td {
          &:first-child {
            border-right: 1px solid $color-grey-75;
            background-color: $color-grey-92;
          }

          text-align: center;
        }
      }

      th,
      td {
        padding: 7px 16px;
        border-bottom: 1px solid $color-grey-75;
      }
      }
  }

  .btn-save:hover span {
    text-decoration: underline;
  }

  .btn-dropdown {
    cursor: pointer;

    span {
      color: $color-grey-55;
    }

    &:hover span {
      text-decoration: underline;
    }
  }
}
</style>
