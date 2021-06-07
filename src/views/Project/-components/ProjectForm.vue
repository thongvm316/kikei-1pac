<template>
  <a-form ref="prjectFormRef" :rules="projectFormRules" :model="projectParams" layout="vertical" @submit="onSubmit">
    <a-form-item name="companyId" label="クライアント名">
      <div>
        <span v-if="!!companyOwnerData" class="text-grey-55 mr-8">{{ companyOwnerData.name }}</span>
        <p class="modal-link" @click="openCompanySearchForm('owner')">選択</p>
      </div>
    </a-form-item>

    <a-form-item name="code" label="プロジェクトコード">
      <a-input value="" disabled style="width: 116px" placeholder="GXX-YYYY-ZZZ" />
    </a-form-item>

    <a-form-item name="name" label="プロジェクト名">
      <a-input v-model:value="projectParams.name" placeholder="入力してください" style="width: 300px" />
    </a-form-item>

    <a-form-item name="clientInCharge" label="顧客担当">
      <a-input v-model:value="projectParams.clientInCharge" placeholder="入力してください" style="width: 300px" />
    </a-form-item>

    <a-form-item name="type" label="区分">
      <a-radio-group v-model:value="projectParams.type" name="projectType" :options="dataTypes" />
    </a-form-item>

    <a-form-item name="statusId" label="ステータス">
      <a-select v-model:value="projectParams.statusId" placeholder="選択してください" style="width: 164px">
        <a-select-option v-for="status in dataStatuses" :key="status.id" :value="status.id">
          {{ status.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item name="accuracyId" label="受注確度">
      <a-select v-model:value="projectParams.accuracyId" placeholder="選択してください" style="width: 164px">
        <a-select-option v-for="accuracy in dataAccuracies" :key="accuracy.id" :value="accuracy.id">
          {{ accuracy.code }} ({{ accuracy.name }})
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item name="releaseDate" label="リリース日（予定）">
      <a-date-picker v-model:value="projectParams.releaseDate" format="YYYY/MM/DD" placeholder="YYYY/MM/DD" />
    </a-form-item>

    <a-form-item v-if="projectParams.type === 0" name="statisticsMonth" label="計上予定月">
      <a-month-picker
        v-model:value="projectParams.statisticsMonth"
        style="width: 164px"
        format="YYYY/MM"
        placeholder="YYYY/MM"
      >
        <template #suffixIcon>
          <calendar-outlined />
        </template>
      </a-month-picker>
    </a-form-item>
    <a-form-item v-else name="statisticsMonths" label="計上予定月">
      <a-range-picker
        v-model:value="projectParams.statisticsMonths"
        style="width: 300px"
        format="YYYY/MM"
        :placeholder="['YYYY/MM', 'YYYY/MM']"
      >
        <template #suffixIcon>
          <calendar-outlined />
        </template>
      </a-range-picker>
    </a-form-item>

    <a-form-item name="groupId" label="請求グループ">
      <a-select v-model:value="projectParams.groupId" placeholder="選択してください" style="width: 164px">
        <a-select-option v-for="group in dataGroups" :key="group.id" :value="group.id">
          {{ group.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item name="director" label="ディレクタ（予定）">
      <a-input v-model:value="projectParams.director" placeholder="入力してください" style="width: 300px" />
    </a-form-item>

    <a-form-item name="accountId" label="営業担当">
      <a-select v-model:value="projectParams.accountId" placeholder="入力してください" style="width: 164px">
        <a-select-option v-for="account in dataAccounts" :key="account.id" :value="account.id">
          {{ account.fullname }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item name="money" label="金額">
      <a-input-number v-model:value="projectParams.money" placeholder="入力してください" style="width: 300px" />
    </a-form-item>

    <a-form-item name="adProjectOrders" label="外注">
      <div class="outsource">
        <template v-for="(order, index) in companyOutsources" :key="order.key">
          <div class="outsource__item">
            <div>
              <p>会社名</p>
              <div v-if="order.companyId" class="outsource__company-info">
                <p class="text-grey-500">{{ order.companyName }}</p>
                <p @click="removeCompany(order)">削除</p>
              </div>

              <p v-else class="modal-link" @click="openCompanySearchForm('outsource', index)">選択</p>
            </div>
            <div>
              <p>金額</p>
              <a-input-number v-model:value="order.money" placeholder="タグを入力してください" style="width: 164px" />
            </div>
            <div>
              <p>Action</p>
              <a-button type="danger" @click="removeOutsourceData(order)">削除</a-button>
            </div>
          </div>
        </template>

        <a-button class="outsource__btn" @click="addDummyOutsourceData">
          <template #icon>
            <span class="btn-icon"><line-add-icon /></span>
          </template>
          外注を追加
        </a-button>

        <p class="outsource__total">外注費合計: {{ $filters.number_with_commas(totalMoneyOutsourcing) }} (VND)</p>
      </div>
    </a-form-item>

    <a-form-item name="tag" label="タグ">
      <a-input v-model:value="projectParams.tag" placeholder="タグを入力してください" style="width: 300px" />
    </a-form-item>

    <a-form-item name="memo" label="メモ">
      <a-input v-model:value="projectParams.memo" placeholder="入力してください" style="width: 300px" />
    </a-form-item>

    <a-form-item>
      <a-button @click="$router.go(-1)">キャンセル</a-button>
      <a-button type="primary" :loading="loading" style="margin-left: 8px" @click="onSubmit">登録</a-button>
    </a-form-item>
  </a-form>

  <project-company-form v-model:visible="isCompanySearchFormOpen" @select-company="selectCompany" />
</template>

<script>
import { defineComponent, ref, reactive, onBeforeMount, computed, watch } from 'vue'
import moment from 'moment'
import { uniqueId } from 'lodash-es'
import { CalendarOutlined } from '@ant-design/icons-vue'
import { PROJECT_TYPES } from '@/enums/project.enum'
import { useAccountList } from '../composables/useAccountList'
import { useGroupList } from '../composables/useGroupList'
import { getProjectAccuracies, getProjectStatuses, addProject } from '../composables/useProject'
import ProjectCompanyForm from './ProjectCompanyForm'
import LineAddIcon from '@/assets/icons/ico_line-add.svg'
import { deepCopy } from '@/helpers/json-parser'

export default defineComponent({
  name: 'ProjectForm',

  components: {
    CalendarOutlined,
    ProjectCompanyForm,
    LineAddIcon
  },

  props: {
    edit: Boolean
  },

  setup(props) {
    const edit = props.edit

    const prjectFormRef = ref()
    const projectParams = reactive({
      companyId: null,
      name: '',
      clientInCharge: '',
      type: PROJECT_TYPES[0].value,
      statusId: null,
      accuracyId: null,
      releaseDate: null,
      statisticsMonth: null,
      statisticsMonths: [],
      groupId: null,
      accountId: null,
      director: '',
      money: '',
      tag: '',
      memo: '',
      adProjectOrders: []
    })
    const loading = ref(false)

    const isCompanySearchFormOpen = ref(false)
    const companyTargetSearch = ref('owner') // owner || outsource
    const outsouringCompanyTarget = ref()
    const companyOwnerData = ref({})
    const companyOutsources = reactive([])

    const dataTypes = reactive(PROJECT_TYPES)
    const dataAccounts = ref([])
    const dataGroups = ref([])
    const dataStatuses = ref([])
    const dataAccuracies = ref([])

    // input validator rules
    const projectFormRules = ref({
      companyId: [{ type: 'number', required: true, message: 'Please select company', trigger: 'change' }],
      name: [{ required: true, message: 'Please input project name', trigger: 'change' }],
      statusId: [{ type: 'number', required: true, message: 'Please select status', trigger: 'change' }],
      accuracyId: [{ type: 'number', required: true, message: 'Please select accuracy', trigger: 'change' }],
      statisticsMonth: [
        { type: 'object', required: true, message: 'Please select statistics month', trigger: ['blur', 'change'] }
      ],
      statisticsMonths: [
        { type: 'array', required: true, message: 'Please select statistics months', trigger: ['blur', 'change'] }
      ],
      groupId: [{ type: 'number', required: true, message: 'Please select group', trigger: 'change' }],
      accountId: [{ type: 'number', required: true, message: 'Please select account', trigger: 'change' }],
      money: [{ type: 'number', required: true, message: 'Please input valid money', trigger: 'change' }]
    })

    /* --------------------- handle search company ------------------- */
    const addDummyOutsourceData = () => {
      const emptyOutsourceData = {
        companyId: '',
        companyName: '',
        key: uniqueId('__outsource__'),
        money: ''
      }
      companyOutsources.push(deepCopy(emptyOutsourceData))
    }

    const removeOutsourceData = (order) => {
      const index = companyOutsources.findIndex((data) => data.key === order.key)
      if (index < 0) return

      companyOutsources.splice(index, 1)
    }

    const openCompanySearchForm = (target, key = null) => {
      companyTargetSearch.value = target
      isCompanySearchFormOpen.value = true

      if (target === 'outsource') {
        outsouringCompanyTarget.value = key
      }
    }

    const selectCompany = (payload) => {
      if (companyTargetSearch.value === 'owner') {
        projectParams.companyId = parseInt(payload.id)
        companyOwnerData.value = payload
      } else {
        const order = companyOutsources[outsouringCompanyTarget.value]
        if (!order) return

        order.companyId = payload.id
        order.companyName = payload.name
      }
    }

    const removeCompany = (order) => {
      order.companyId = ''
      order.companyName = ''
    }
    /* --------------------- ./handle search company ------------------- */

    const dynamicBaseOnAccuracy = () => {
      if (highestAccuracyRequired.value) {
        projectFormRules.value.tag = [{ required: true, message: 'Please input tag', trigger: 'change' }]
        projectFormRules.value.memo = [{ required: true, message: 'Please input tag', trigger: 'change' }]
      } else {
        projectFormRules.value.tag = []
        projectFormRules.value.memo = []
      }
    }

    const totalMoneyOutsourcing = computed(() => {
      if (companyOutsources.length <= 0) return 0
      return companyOutsources.reduce((acc, curr) => acc + curr.money, 0)
    })

    const highestAccuracyRequired = computed(() => {
      if (!projectParams.accuracyId || dataAccuracies.value.length <= 0) return false
      const accuracy = dataAccuracies.value.filter((da) => da.id === projectParams.accuracyId)[0]
      if (!accuracy) return false
      // TODO: hard check more
      return accuracy.code === 'S'
    })

    /* -------------------- init data if edit ------------------------- */
    // TODO: waiting for API
    // const initProjectData = () => {

    // }
    /* -------------------- ./init data if edit ------------------------- */

    /* ------------------- api intergration --------------------------- */
    const projectOutsouringOrders = () => {
      if (companyOutsources.length <= 0) return null
      return companyOutsources.map((item) => {
        const shadownItem = {
          id: item.id ? item.id : null,
          companyId: item.companyId,
          money: item.money,
          note: '112233'
        }
        if (!shadownItem.id) delete shadownItem.id

        return shadownItem
      })
    }

    const projectDataRequest = computed(() => {
      let dataRequest = {
        ...projectParams,
        releaseDate: projectParams.releaseDate ? moment(projectParams.releaseDate).format('YYYY-MM-DD') : null,
        statisticsFromMonth:
          projectParams.type === 0
            ? moment(projectParams.statisticsMonth).format('YYYY-MM-DD')
            : moment(projectParams.statisticsMonths[0]).format('YYYY-MM-DD'),
        statisticsToMonth:
          projectParams.type === 0
            ? moment(projectParams.statisticsMonth).format('YYYY-MM-DD')
            : moment(projectParams.statisticsMonths[1]).format('YYYY-MM-DD'),
        adProjectOrders: projectOutsouringOrders()
      }

      delete dataRequest.statisticsMonth
      delete dataRequest.statisticsMonths

      return dataRequest
    })

    const onSubmit = async () => {
      try {
        const validateRes = await prjectFormRef.value.validate()
        if (validateRes) {
          addProject(projectDataRequest.value)
        }
      } catch (e) {
        console.log(e)
      }
    }
    /* ------------------- api intergration --------------------------- */

    watch(highestAccuracyRequired, dynamicBaseOnAccuracy)
    onBeforeMount(async () => {
      dataAccounts.value = await useAccountList()
      // groups
      dataGroups.value = await useGroupList()
      // statuses
      const statuses = await getProjectStatuses()
      dataStatuses.value = statuses
      // accuracies
      const accuracies = await getProjectAccuracies()
      dataAccuracies.value = accuracies
    })

    return {
      prjectFormRef,
      projectParams,
      projectFormRules,
      dataGroups,
      dataTypes,
      dataStatuses,
      dataAccounts,
      dataAccuracies,
      loading,
      isCompanySearchFormOpen,
      companyOwnerData,
      companyOutsources,
      totalMoneyOutsourcing,
      openCompanySearchForm,
      addDummyOutsourceData,
      removeOutsourceData,
      removeCompany,
      selectCompany,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/shared/variables';
@import '@/styles/shared/mixins';

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

.modal-link {
  color: $color-additional-blue-6;
  margin-bottom: 0;
  display: inline-block;
  cursor: pointer;
}

.outsource {
  padding: 0 24px;
  max-width: 100%;

  p {
    margin-bottom: 0;
  }

  &__item {
    @include flexbox(flex-start, flex-start);
    margin-top: 8px;

    div + div {
      margin-left: 40px;
    }

    p {
      margin-bottom: 4px;
    }
  }

  &__item + &__item {
    margin-top: 8px;
  }

  &__item + &__btn {
    margin-top: 12px;
  }

  &__total {
    margin-top: 12px;
    padding-top: 12px;
    margin-bottom: 0;
    color: $color-grey-55;
    border-top: 1px dashed $color-grey-55;
    text-align: right;
  }

  &__company-info {
    @include flexbox(flex-start, center);

    p + p {
      margin-left: 12px;
      cursor: pointer;
      color: $color-additional-red-6;
    }
  }
}
</style>
