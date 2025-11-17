import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import TemplatesPage from '@/pages/TemplatesPage.vue'
import AboutPage from '@/pages/AboutPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/templates', component: TemplatesPage },
  { path: '/about', component: AboutPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
