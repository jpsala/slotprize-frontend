<template>
<Player @back="selected = undefined" v-if="selected" :player="selected" @change="playerChange"/>
  <div v-else class="players q-pa-md">
    <q-input style="width:400px" bottom-slots v-model="filter" label="Filter">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon name="close" @click="filter = ''" class="cursor-pointer" />
      </template>
    </q-input>
    <q-separator inset/>
    <q-table @row-click="rowClick"
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
      selected: undefined
    })
    const rowClick = (_, row) => {
      state.selected = state.items.find(item => item.device_id === row['device Id'])
    }
    const getItemsFromDB = async () => {
      const resp = await axios({
        url: '/slot/playersForFront',
        params: {
          from: 0,
          limit: state.cant,
          filter: state.filter
        }
      })
      state.items = resp.data
    }
    const itemsForTable = computed(() => {
      return state.items.map(player => {
        return {
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
    watch(() => loggedIn, getItemsFromDB, { immediate: true })
    watch(() => state.filter, debounce(async () => await getItemsFromDB(), 500))
    return { ...toRefs(state), loggedIn, rowClick, playerChange, itemsForTable }
  }
}
</script>

<style lang='stylus'>
  .q-table
    height 60vh
</style>
