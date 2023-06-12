import {
  createWebHistory,
  createRouter
} from "vue-router";

import Home from '../views/pages/Home/home.vue';

import Page404 from '../views/pages/Page404/page404.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'HomeView',
    component: Home,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
