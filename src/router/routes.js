
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'events', component: () => import('pages/Events.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
      { path: 'jackpot', component: () => import('pages/Jackpot.vue') },
      { path: 'slotMachine', component: () => import('pages/SlotMachine.vue') },
      { path: 'raffles', component: () => import('pages/Raffles.vue') },
      { path: 'players', component: () => import('pages/Players.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
