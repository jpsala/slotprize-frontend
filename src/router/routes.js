const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: 'config-symbols', component: () => import('pages/ConfigSymbols.vue') },
      { path: 'config-reels', component: () => import('pages/ConfigReels.vue') },
      { path: 'config-pay-table', component: () => import('pages/ConfigPayTable.vue') },
      { path: 'login', component: () => import('pages/Login.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
