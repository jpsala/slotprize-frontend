<template>
  <div>
    <q-table
      class="q-mt-lg"
      :data="items"
      row-key="raffleItemId"
      :pagination="initialPagination"
    />
  </div>
</template>

<script>
import {
  onMounted,
  reactive,
  toRefs
} from '@vue/composition-api'
import axios from '../services/axios'
import { format } from 'date-fns'
import useGlobal from '../services/useGlobal'

const { showSpinner, hideSpinner } = useGlobal()

export default {
  props: {
    player: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      items: [],
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      }
    })
    onMounted(async () => {
      showSpinner()
      const resp = await axios.get(`/slot/raffle_purchase_history?deviceId=${props.player.device_id}`)
      hideSpinner()
      state.items = resp.data.map(item => {
        return {
          Raffle: item.name,
          Tickets: item.tickets,
          Numbers: item.numbers,
          Description: item.description,
          'Closing Date': format(new Date(item.closingDate), 'yyyy-MM-dd'),
          'Transaction Date': format(new Date(item.transactionDate), 'yyyy-MM-dd')
        }
      })
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style>

</style>
