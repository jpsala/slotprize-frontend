
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
import Player from 'src/components/Player'
import Balance from 'src/pages/Balance'
import Spins from 'src/pages/SpinSettings'
import Winners from 'src/pages/Winners'
import DailyReward from 'src/pages/DailyReward'
import TestRules from 'src/pages/TestRules'
import AdsSettings from 'src/pages/AdsSettings'
import Error404 from 'src/pages/Error404'
import MainLayout from 'src/layouts/MainLayout'
import GeneralSettings from 'src/pages/GeneralSettings'
import Legals from 'src/pages/Legals'
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
      { path: 'winners', component: Winners },
      { path: 'testRules', component: TestRules },
      { path: 'dailyreward', component: DailyReward },
      { path: 'balance', component: Balance },
      { path: 'countries', component: Countries },
      { path: 'adsSettings', component: AdsSettings },
      { path: 'supportAdmin', component: SupportAdmin },
      { path: 'players', component: Players },
      { path: 'generalSettings', component: GeneralSettings },
      { path: 'legals', component: Legals },
      { path: 'player', component: Player }
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
