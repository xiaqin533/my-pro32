import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/components/login/login.vue')
const Home = () => import('@/components/home/home.vue')
const Users = () => import('@/components/home/users.vue')
const RoleList = () => import('@/components/home/rolelist.vue')
const Rights = () => import('@/components/home/rights.vue')
// 导入商品列表
const Goods = () => import('@/components/home/goods.vue')
// 导入分类参数
const Params = () => import('@/components/home/params.vue')
// 导入s商品分类
const Categories = () => import('@/components/home/categories.vue')
// 导入 商品添加页面
const GoodsAdd = () => import('@/components/home/goodsadd.vue')
//导入订单列表(百度地图)
const orders = () => import('@/components/home/orders.vue')
// 导入图表
const reports = () => import('@/components/home/reports.vue')
// 单独引用  message
import { Message } from 'element-ui';

Vue.use(Router)
let router = new Router({
  routes: [
    // 添加一个login路由
    {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users,
        },
        {
          path: '/roles',
          name: 'rolelist',
          component: RoleList,
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights,
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods,
        },
        {
          path: '/params',
          name: 'params',
          component: Params,
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories,
        },
        {
          path: '/goodsadd',
          name: 'goodsadd',
          component: GoodsAdd,
        },
        {
          path: '/orders',
          name: 'orders',
          component: orders,
        },
        {
          path: '/reports',
          name: 'reports',
          component: reports,
        },
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // to:要去的路由对应的对象
  // from:离开的路由要去的对象
  // next:后续代码
  // 判断请求的是否是   login 
  if (to.path !== "/login") {

    let token = window.localStorage.getItem("token")
    // 判断是否存在token(有一种情况是不需要判断  token ,当请求是   login )
    if (!token) {
      //跳转路由  提示信息
      Message.error("您还没有登录,请先登录")
      // 组件之外
      // next("/login")
      router.push("/login")
    } else {
      // 存在.继续向后执行
      next()
    }
  } else {
    next();
  }



})

export default router