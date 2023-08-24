import {createRouter, createWebHashHistory} from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import Article from '../views/Article.vue';
import Welcome from '../views/Welcome.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
      meta: {
        title: 'Welcome'
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        title: 'Profile'
      }
    },
    {
      path: '/article',
      name: 'Article',
      component: Article,
      meta: {
        title: 'Article'
      }
    },
  ]
})

const DEFAULT_TITLE = 'TITLE'

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
