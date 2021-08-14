import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: { title: '管理员管理', icon: 'panel' },
    children: [{
      path: 'list',
      name: 'UserList',
      hidden: true,
      component: () => import('@/views/user/index'),
      meta: { title: '管理员列表', icon: 'panel' }
    }]
  },
  {
    path: '/client',
    component: Layout,
    redirect: '/client/list',
    meta: { title: '用户管理', icon: 'panel' },
    children: [
      {
        path: 'list',
        redirect: '/client/list',
        component: () => import('@/views/client/list/index'),
        meta: { title: '客户列表' },
        children: [
          {
            path: '/',
            name: 'list',
            hidden: true,
            component: () => import('@/views/client/list/ClientList')
          },
          {
            path: 'add',
            name: 'AddConsult',
            hidden: true,
            component: () => import('@/views/client/list/ConsultAdd'),
            meta: { title: '新增咨询' }
          },
          {
            path: 'detail',
            name: 'Detail',
            hidden: true,
            component: () => import('@/views/client/list/detail/index'),
            meta: { title: '客户详情' },
            children: [
              {
                path: 'info/:cguid',
                name: 'ClientDetail',
                hidden: true,
                component: () => import('@/views/client/list/detail/ClientDetail')
              },
              {
                path: 'consultlist',
                name: 'ConsultList',
                hidden: true,
                component: () => import('@/views/client/list/detail/ConsultList')
              },
              {
                path: 'update',
                name: 'UpdateConnect',
                hidden: true,
                component: () => import('@/views/client/list/detail/UpdateConnect'),
                meta: { title: '添加/编辑联系人' }
              }
            ]
          }
        ]
      },
      {
        path: 'add',
        name: 'ClientList',
        component: () => import('@/views/client/ClientAdd'),
        meta: { title: '添加客户' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
