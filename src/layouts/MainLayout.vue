<template>
  <q-layout view="hHh lpR fFf">
    <q-ajax-bar size="2px" />

    <q-header elevated :class="isDev ? 'bg-secondary text-subtitle1':''">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click.stop="left = !left" />
        <q-toolbar-title>
          <q-avatar style="width: 70px; height: 45px">
            <div class="text-subtitle1">Wopidom</div>
          </q-avatar>
        </q-toolbar-title>
        <span v-show="isDev" class="q-mr-md" style="color:red; font-size: 100%">DevMode!</span>
        <span class="q-mr-md" style="color:white; font-size: 110%">UTC Date {{utcDate}}</span>
        <q-btn
          v-if="$route.path !== '/login' && !loggedIn"
          flat
          @click="$router.push('/login')"
        >
          <span>Ingreso/Registro</span>
        </q-btn>
        <!-- profile menu , ya ingresó-->
        <q-spinner-tail v-show="loading"
          color="white"
          size="2em"
        />
        <q-btn-dropdown
          v-if="loggedIn"
          id="profile-btn"
          ref="profileBtn"
          v-remove-arrow
          icon="person"
          rounded
          unelevated
          :label="user.name"
        >
          <q-list style="width: 180px">
            <q-item v-close-popup v-ripple clickable>
              <q-item-section side>
                <q-icon name="exit_to_app" />
              </q-item-section>
              <q-item-section @click="logout" >Cerrar Sesión</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-drawer
      ref="drawer"
      v-model="left"
      show-if-above
      :breakpoint="800"
      :width="260"
      side="left"
      bordered
      no-swipe-close
    >
      <q-list class="rounded-borders">
        <my-drawer-content v-if="loggedIn" :items="items" />
        <!-- <q-item
          v-if="loggedIn"
          exact
          style="cursor: pointer"
          @click.native="logout()"
        >
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>Cerrar Sesión</q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>
    <q-page-container id="venta-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onBeforeMount } from '@vue/composition-api'
import { RemoveArrow } from 'app/src/components/RemoveArrowDirective'
import myDrawerContent from 'app/src/components/MyDrawerContent'
import useSession from '../services/useSession'
import useWindowResize from '../services/useWindowResize'
import useGlobal from '../services/useGlobal'
import { router } from '../boot/router'

function setItemsDefaults (items, level = 0) {
  items.forEach((e) => {
    if (e.protected === undefined) e.protected = false
    e.level = level
    // if (level === 0) e.group = 'uno';
    e.group = String(level)
    if (e.items) {
      level += 0.3
      e.items = setItemsDefaults(e.items, level)
      level -= 0.3
    }
  })
  return items
}
export default {
  directives: { RemoveArrow },
  components: { myDrawerContent },

  setup () {
    const { loading, isDev, utcDate } = useGlobal()
    const items = ref(
      setItemsDefaults([
        {
          label: 'Home',
          icon: 'home',
          to: '/'
        },
        {
          label: 'Config',
          icon: 'build',
          open: true,
          items: [
            { label: 'Events', to: '/events' },
            { label: 'Players', to: '/players' },
            { label: 'Jackpot', to: '/jackpot' },
            { label: 'Raffles', to: '/raffles' },
            { label: 'Languages', to: '/languages' },
            { label: 'Skins', to: '/skins' },
            { label: 'Winners', to: '/winners' },
            { label: 'Daily Rewards', to: '/dailyreward' },
            { label: 'Tickets', to: '/tickets' },
            { label: 'Spins', to: '/spins' },
            { label: 'Ads Settings', to: '/adsSettings' },
            { label: 'Support Admin', to: '/supportAdmin' },
            { label: 'Slot Machine', to: '/slotMachine' }
          ]
        }
      ])
    )
    const Screen = useWindowResize()

    const left = ref(false)
    const {
      tryToLogin, loggedIn, user, logout: sessionLogout
    } = useSession()
    const logout = () => {
      sessionLogout()
    //   if (root.$route.path !== '/login') root.$router.push('/login');
    }
    onBeforeMount(async () => {
      try {
        const isLoggedIn = await tryToLogin()
        if (!isLoggedIn) router.push('/login')
      } catch (error) {
        console.log('error!!! trying to login in app.vue', error)
      }
    })
    return {
      logout, left, items, loggedIn, Screen, user, loading, isDev, utcDate
    }
  }
}
</script>
