import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      component: () => import('@/components/HelloWorld')
    },
    {
      path: '/page1',
      name: 'page1',
      component: () => import('@/components/page1')
    },
    {
      path: '/page2',
      name: 'page2',
      component: () => import('@/components/page2')
    },
    {
      path: '/page3',
      name: 'page3',
      component: () => import('@/components/page3')
    }
  ]
})
