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
  Radio,
  Form,
  Select,
  Tag
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
    .use(Radio)
    .use(Form)
    .use(Select)
    .use(Input)
    .use(Tag)
}

export default globalComponents
