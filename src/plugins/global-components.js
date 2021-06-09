/* eslint-disable prettier/prettier */
import {
  Typography,
  Button,
  DatePicker,
  Checkbox,
  Pagination,
  Table,
  Layout,
  Collapse,
  Modal,
  Select,
  Form,
  Input,
  InputNumber,
  Icon,
  ConfigProvider,
  Breadcrumb,
  Popover,
  Menu,
  Radio,
  Tag,
  notification,
  Tabs,
  Tooltip
} from 'ant-design-vue'

const globalComponents = (app) => {
  app.use(Typography)
    .use(Button)
    .use(DatePicker)
    .use(Checkbox)
    .use(Pagination)
    .use(Table)
    .use(Layout)
    .use(Collapse)
    .use(Modal)
    .use(Form)
    .use(Input)
    .use(InputNumber)
    .use(Icon)
    .use(ConfigProvider)
    .use(Breadcrumb)
    .use(Popover)
    .use(Menu)
    .use(Radio)
    .use(Select)
    .use(Tag)
    .use(Tabs)
    .use(Tooltip)

  // Config global notification
  app.config.globalProperties.$notification = notification
}

export default globalComponents