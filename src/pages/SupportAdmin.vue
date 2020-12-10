<template>
  <div class="q-pa-md q-gutter-md justify-center support-admin">
    <h3 class="q-ml-xl q-pl-xl">
      Support Admin
    </h3>
    <q-form class="q-gutter-md">
      <div class="row">
        <q-input
          autofocus
          v-model="email"
          label="Email for support *"
          type="email"
          @input="requestChange()"
        />
      </div>
    </q-form>
    <div class="tableFixHead">
    <q-markup-table class="q-mt-xl">
      <thead>
        <tr>
          <th class="text-left">
            DeviceID
          </th>
          <th class="text-left">
            Email
          </th>
          <th class="text-left">
            Name
          </th>
          <th class="text-left">
            Message
          </th>
          <th class="text-right">
            Created At
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="request of requests"
          :key="request.id"
          :class="request.state"
          @click="showPlayer(request.userId, $event)"
          class="cursor-pointer"
        >
          <td class="text-left">
            {{ request.deviceId }}
          </td>
          <td class="text-left">
            {{ request.email }}
          </td>
          <td class="text-left">
            {{ request.name }}
          </td>
          <td class="text-left">
            {{ request.message }}
          </td>
          <td class="text-right">
            {{ request.createdAt }}
          </td>
          <td>
            <q-select
              dense
              v-model="request.state"
              :options="['New', 'Open', 'Closed']"
              @input="requestChange(request)"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    </div>
    <player-dialog
      persistent
      :player="playerForShowing"
      @close="playerForShowing = undefined"
    />
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import playerDialog from '../components/PlayerDialog'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import { debounce } from 'quasar'
import useGlobal from '../services/useGlobal'

const { showSpinner, hideSpinner } = useGlobal()

export default {
  components: { playerDialog },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      email: undefined,
      requests: undefined,
      playerForShowing: undefined
    })
    const showPlayer = async (player, event) => {
      if (event.target.tagName !== 'TD') return
      const response = await axios({ url: '/slot/playerForFront', method: 'get', params: { id: player } })
      state.playerForShowing = response.data
    }
    const requestChange = debounce(async (request) => {
      await axios({
        url: '/slot/support_admin_for_crud',
        method: 'post',
        data: { request, email: state.email }
      })
    }, 800)
    watch(
      () => loggedIn,
      async () => {
        showSpinner()
        const response = await axios({ url: '/slot/support_admin_for_crud', method: 'get' })
        hideSpinner()
        state.email = response.data.email
        state.requests = response.data.requests
      },
      { immediate: true }
    )
    return { ...toRefs(state), requestChange, showPlayer }
  }
}
</script>

<style lang="sass">
  .support-admin
    .New
      background-color: white
    .Open
      background-color: $green-1
    .Closed
      background-color: $grey-2
    .q-markup-table
      overflow-y: auto
      height: 73vh
    .q-markup-table thead th
      position: sticky !important
      top: 0
    table
      border-collapse: collapse
      overflow: display
    th
      background-color: white
</style>
