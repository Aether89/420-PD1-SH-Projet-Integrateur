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
        path: 'NouvelEmployes',
        name: 'Liste des Employés',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeEmployes.vue'),

      },

      {
        path: 'listeEmployes',
        name: 'Liste des Employés',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeEmployes.vue'),

      },
      {
        path: 'vehicle/:id',
        name: 'Informations du Véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/DetailledVehicle.vue'),
        props: true,
      },
      {
        path: 'newappointment/:id',
        name: 'Prise de rendez-vous',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewAppointment.vue'),
        props: true,
      },
      {
        path: 'admin/:newvehicle',
        name: 'Nouveau véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewVehicule.vue'),
        props: true,
      },
      {
        path: 'vehicle/:id/edition',
        name: 'Édition véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewVehicule.vue'),
        props: true,
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
