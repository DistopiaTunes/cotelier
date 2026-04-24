import { createRouter, createWebHistory } from 'vue-router'
import Cotelier from '../components/Cotelier.vue'
import PinturaEmTela from '../views/PinturaEmTela.vue'

const routes = [
  { path: '/', name: 'home', component: Cotelier },
  { path: '/pintura-em-tela', name: 'pintura-em-tela', component: PinturaEmTela },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})
