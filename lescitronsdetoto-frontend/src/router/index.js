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
        path: 'changePassword',
        name: 'changePassword',
        component: () => import(/* webpackChunkName: "home" */ '@/views/MustChangePass.vue'),
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
        path: 'listeEmployes',
        name: 'Liste des Employés',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeEmployes.vue'),

      },
      {
        path: 'listeClients',
        name: 'Liste des Clients',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeClients.vue'),

      },
      {
        path: 'listeAccessoires',
        name: 'Liste des Accessoires',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeAccessoires.vue'),

      },
      {
        path: 'listeInterventions',
        name: 'Liste des Interventions',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeInterventions.vue'),

      },
      {
        path: 'vehicle/:id',
        name: 'Informations du Véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/DetailledVehicle.vue'),
        props: true,
      },
      {
        path: 'admin/:mode',
        name: 'Nouveau véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewVehicule.vue'),
        props: true,
      },
      {
        path: 'vehicle/:id/edition',
        name: 'Édition véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/NewVehicule.vue'),
        props: true,
      },
      {
        path: 'EditerEmploye',
        name: 'Édition Employe',
        component: () => import(/* webpackChunkName: "home" */ '@/views/InfoEmploye.vue'),
      },
      {
        path: 'achat/:mode',
        name: 'Achat véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/AchatVehiculeForm.vue'),
        props: true
      },
      {
        path: 'vente/:mode',
        name: 'Vente véhicule',
        component: () => import(/* webpackChunkName: "home" */ '@/views/VenteVehicule.vue'),
        props: true
      },
      {
        path: 'transaction',
        name: 'Transaction',
        component: () => import(/* webpackChunkName: "home" */ '@/views/ListeTransaction.vue'),
        props: true
      },
      {
        path: 'transaction/editer/:id',
        name: 'Édition de transaction',
        component: () => import(/* webpackChunkName: "home" */ '@/views/EditionTransaction.vue'),
        props: true
      },
   {
        path: 'manage/availability',
        name: 'Gestion des disponibilités',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Manage.vue'),
      },
      {
        path: 'reservation',
        name: 'Réservation',
        component: () => import(/* webpackChunkName: "home" */ '@/components/appointment/reservation.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
