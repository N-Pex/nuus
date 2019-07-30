import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('./views/Home.vue'),
          props: true
        },
        {
          path: '/categories',
          name: 'categories',
          component: () => import('./views/Home.vue'),
          props: { headerType: 'categories', headerTitle: 'SECTIONS' }
        },
        {
          path: '/saved',
          name: 'saved',
          component: () => import('./views/Home.vue'),
          props: { headerType: 'saved', headerTitle: 'SAVED' }
        }
      ]
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('./views/Onboarding.vue')
    }
  ]
})
