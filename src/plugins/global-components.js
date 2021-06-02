/* eslint-disable prettier/prettier */
import {
  Button,
  DatePicker,
  Checkbox,
  Pagination,
  Table,
  Layout,
  Collapse,
  Modal,
  Input,
  Icon,
  ConfigProvider,
  Breadcrumb,
  Popover,
  Menu,
  notification,
  Select,
  Radio
} from 'ant-design-vue'

const globalComponents = (app) => {
  app.use(Button)
    .use(DatePicker)
    .use(Checkbox)
    .use(Pagination)
    .use(Table)
    .use(Layout)
    .use(Collapse)
    .use(Modal)
    .use(Input)
    .use(Icon)
    .use(ConfigProvider)
    .use(Breadcrumb)
    .use(Popover)
    .use(Menu)
    .use(Select)
    .use(Radio)
  // Config global notification
  app.config.globalProperties.$notification = notification
}

export default globalComponents
