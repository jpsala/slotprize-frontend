<template>
  <Player
    @back="selected = undefined"
    v-if="selected"
    :player="selected"
    @change="playerChange"
  />
  <div
    v-else
    class="players q-pa-md"
  >
    <div class="row q-mb-xl">
      <q-input
        class="q-mx-lg col-4"
        autofocus
        v-model="maxAllowedBirthYear"
        label="Max Allowed Birth Year"
        :hint="hintForMaxAllowedBirthYear"
      />
      <q-btn dense color="primary" @click="submitMaxAllowedBirthYear" >
        Submit
      </q-btn>
    </div>
    <q-input
      style="width:400px"
      bottom-slots
      v-model="filter"
      label="Filter"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
      <template #append>
        <q-icon
          name="close"
          @click="filter = ''"
          class="cursor-pointer"
        />
      </template>
    </q-input>
    <q-separator inset />
    <q-table
      @row-click="rowClick"
      class="q-mt-lg"
      title="Players"
      :data="itemsForTable"
      row-key="first_name"
      :pagination="initialPagination"
    >
     <template v-slot:body="props">
        <q-tr :props="props">
           <q-td key="Banned" :props="props">
            <q-btn @click ="banUser(props.row.ID)" outline :color="props.row.Banned ? 'red-8' : 'primary'">{{props.row.Banned ? 'UnBan' : 'Ban'}}</q-btn>
           </q-td>
           <q-td key="ID" :props="props">
            {{props.row.ID}}
          </q-td>
           <q-td key="First Name" :props="props">
            {{props.row['First Name']}}
          </q-td>
           <q-td key="Last Name" :props="props">
            {{props.row['Last Name']}}
          </q-td>
           <q-td key="email" :props="props">
            {{props.row.email}}
          </q-td>
           <q-td key="Device Id" :props="props">
            <q-btn outline @click="rowClick(props.row['Device Id'])">
              {{props.row['Device Id']}}
              </q-btn>
          </q-td>
           <q-td key="Created At" :props="props">
            {{props.row['Created At']}}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { reactive, toRefs, watch, ref, computed } from '@vue/composition-api'
import useSession from '../services/useSession'
import axios from '../services/axios'
import { format } from 'date-fns'
import { debounce } from 'quasar'
import Player from '../components/Player'
import useGlobal from '../services/useGlobal'

const { showSpinner, hideSpinner } = useGlobal()

export default {
  components: { Player },
  setup () {
    const {
      loggedIn
    } = useSession()
    const state = reactive({
      items: [],
      filter: ref(''),
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 50
        // rowsNumber: xx if getting data from a server
      },
      selected: undefined,
      maxAllowedBirthYear: 2002,
      hintForMaxAllowedBirthYear: computed(() => {
        return `Minimun Age ${diffYears(state.maxAllowedBirthYear)}`
      })
    })
    const rowClick = (id) => {
      state.selected = state.items.find(item => item.device_id === id)
    }
    const banUser = async (id) => {
      const resp = await axios.get(`/slot/toggle_ban_for_crud?id=${id}`)
      const banned = Number(resp.data)
      const user = state.items.find(_user => Number(_user.id) === Number(id))
      console.log('user', user)
      user.banned = banned
    }
    function diffYears (year) {
      const now = new Date()
      const yearNow = now.getFullYear()
      return yearNow - Number(year)
    }
    const getItemsFromDB = async () => {
      showSpinner()
      const resp = await axios({
        url: '/slot/playersForFront',
        params: {
          filter: state.filter
        }
      })
      state.items = resp.data.players
      state.maxAllowedBirthYear = resp.data.maxAllowedBirthYear
      hideSpinner()
    }
    const itemsForTable = computed(() => {
      return state.items.map(player => {
        console.log('banned', player)
        return {
          Banned: player.banned === 1,
          ID: player.id,
          'First Name': player.first_name,
          'Last Name': player.last_name,
          email: player.email,
          'Device Id': player.device_id,
          'Created At': format(new Date(player.created_at), 'yyyy-MM-dd')
        }
      })
    })
    const playerChange = () => {
      state.selected = undefined
    }
    const submitMaxAllowedBirthYear = async () => {
      await axios.post(
        '/slot/max_allowed_birth_year',
        { maxAllowedBirthYear: state.maxAllowedBirthYear }
      )
    }
    watch(() => loggedIn, getItemsFromDB, { immediate: true })
    watch(() => state.filter, debounce(async () => await getItemsFromDB(), 500))
    return {
      ...toRefs(state),
      loggedIn,
      rowClick,
      playerChange,
      itemsForTable,
      submitMaxAllowedBirthYear,
      banUser
    }
  }
}
</script>

<style lang='stylus'>
  .q-table
    height 60vh
</style>
