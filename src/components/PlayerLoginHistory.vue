<template>
  <div>
    <q-list bordered separator>
      <q-item>
        <q-item-section style="max-width: 120px">
          Number of logins:
        </q-item-section>
        <q-item-section>
          {{count}}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section style="max-width: 120px">
          Last login:
        </q-item-section>
        <q-item-section>
          {{ lastLogin }}
        </q-item-section>
      </q-item>
    </q-list>
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
      count: undefined,
      lastLogin: undefined
    })
    onMounted(async () => {
      showSpinner()
      const resp = await axios.get(`/slot/get_login_data?userId=${props.player.id}`)
      hideSpinner()
      state.count = resp.data.count
      state.lastLogin = format(new Date(resp.data.lastLogin), 'yyyy/dd/MM')
    })
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style>

</style>
