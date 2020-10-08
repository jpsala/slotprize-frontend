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
    />
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
      cant: 200,
      items: [],
      filter: ref(''),
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      selected: undefined,
      maxAllowedBirthYear: 2002,
      hintForMaxAllowedBirthYear: computed(() => {
        return `Minimun Age ${diffYears(state.maxAllowedBirthYear)}`
      })
    })
    const rowClick = (_, row) => {
      state.selected = state.items.find(item => item.device_id === row['device Id'])
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
          from: 0,
          limit: state.cant,
          filter: state.filter
        }
      })
      state.items = resp.data.players
      state.maxAllowedBirthYear = resp.data.maxAllowedBirthYear
      hideSpinner()
    }
    const itemsForTable = computed(() => {
      return state.items.map(player => {
        return {
          ID: player.id,
          'first Name': player.first_name,
          'last Name': player.last_name,
          email: player.email,
          'device Id': player.device_id,
          'created At': format(new Date(player.created_at), 'yyyy-MM-dd')
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
    return { ...toRefs(state), loggedIn, rowClick, playerChange, itemsForTable, submitMaxAllowedBirthYear }
  }
}
</script>

<style lang='stylus'>
  .q-table
    height 60vh
</style>
