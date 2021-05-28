import { Button, DatePicker } from 'ant-design-vue'

const globalComponents = (app) => {
  app.use(Button)
  app.use(DatePicker)
}

export default globalComponents
