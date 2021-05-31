/* eslint-disable prettier/prettier */
import {
  Button,
  DatePicker,
  Checkbox,
  Pagination,
  Table,
  Layout,
  Collapse
} from 'ant-design-vue'

const globalComponents = (app) => {
  app.use(Button)
    .use(DatePicker)
    .use(Checkbox)
    .use(Pagination)
    .use(Table)
    .use(Layout)
    .use(Collapse)
}

export default globalComponents
