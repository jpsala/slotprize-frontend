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
      console.log('detalle', props.player)
      const resp = await axios.get(`/slot/support_request_for_crud?userId=${props.player.id}`)
      state.items = resp.data.map(item => {
        item.createdAt = format(new Date(item.createdAt), 'yyyy-MM-dd')
        delete item.id
        delete item.userId
        delete item.deviceId
        return item
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
