
import Skins from 'src/pages/Skins'
import Index from 'src/pages/Index'
import Login from 'src/pages/Login'
import Jackpot from 'src/pages/Jackpot'
import Events from 'src/pages/Events'
import SlotMachine from 'src/pages/SlotMachine'
import Raffles from 'src/pages/Raffles'
import Languages from 'src/pages/Languages'
import Countries from 'src/pages/Countries'
import SupportAdmin from 'src/pages/SupportAdmin'
import Players from 'src/pages/Players'
import Tickets from 'src/pages/Tickets'
import Spins from 'src/pages/SpinSettings'
import AdsSettings from 'src/pages/AdsSettings'
import Error404 from 'src/pages/Error404'
import MainLayout from 'src/layouts/MainLayout'
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Index },
      { path: 'events', component: Events },
      { path: 'login', component: Login },
      { path: 'jackpot', component: Jackpot },
      { path: 'slotMachine', component: SlotMachine },
      { path: 'raffles', component: Raffles },
      { path: 'spins', component: Spins },
      { path: 'languages', component: Languages },
      { path: 'skins', component: Skins },
      { path: 'tickets', component: Tickets },
      { path: 'countries', component: Countries },
      { path: 'adsSettings', component: AdsSettings },
      { path: 'supportAdmin', component: SupportAdmin },
      { path: 'players', component: Players }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: Error404
  }
]

export default routes
