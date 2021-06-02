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
  Breadcrumb,
  Popover,
  Menu
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
    .use(Breadcrumb)
    .use(Popover)
    .use(Menu)
}

export default globalComponents
