// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'login',
        name: 'Connection',
        component: () => import(/* webpackChunkName: "home" */ '@/views/LoginForm.vue'),
      },
      {
        path: 'login/new',
        name: 'Nouveau Compte',
        component: () => import(/* webpackChunkName: "home" */ '@/views/LoginNew.vue'),
      },
      {
        path: 'admin/nouveau-vehicule',
        name: 'Nouveau véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewVehicule.vue')
      },
      {
        path: '/vehicule/:vin/édition',
        name: 'Édition véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewVehicule.vue')
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
