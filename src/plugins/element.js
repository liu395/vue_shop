import Vue from 'vue'
import {Button,Form,FormItem,Input,Message,Header,Container,Aside,
    Main,Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,
Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox} from 'element-ui'

Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.use(Header)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)

Vue.use(Pagination)

Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm
