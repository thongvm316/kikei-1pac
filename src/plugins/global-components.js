import {
  Button,
  DatePicker,
  Checkbox,
  Pagination,
  Table
} from 'ant-design-vue'

const globalComponents = (app) => {
  app.use(Button)
    .use(DatePicker)
    .use(Checkbox)
    .use(Pagination)
    .use(Table)
}

export default globalComponents
