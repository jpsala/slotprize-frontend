
<template>
  <div class="q-pa-md row q-gutter-md justify-center">
    <Jackpot
      ref="jackpotRef"
      :item="selected"
      :show="Boolean(selected)"
      @oncancel="cancel"
      @onsubmit="submit"
    />
    <q-card
      bordered
      class="my-card"
    >
      <q-card-section
        class="bg-primary text-white"
        style="width: 400px"
      >
        <div class="text-h6">
          Jackpot Data
        </div>
      </q-card-section>

      <q-separator
        dark
        inset
      />
      <q-card-section>
        <q-markup-table
          flat
          square
        >
          <thead>
            <tr>
              <th class="text-left">
                Cycle
              </th>
              <th class="text-right">
                Prize
              </th>
              <th class="text-left">
                State
              </th>
              <th class="text-right">
                Spin Count
              </th>
              <th class="text-left">
                Confirmed
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item of items"
              :key="item.id"
              :class="itemClass(item)"
              class="cursor-pointer"
              @click="select(item)"
            >
              <td class="text-left">
                {{ item.cycle }}
              </td>
              <td class="text-right">
                {{ item.prize }}
              </td>
              <td class="text-left">
                {{ item.state }}
              </td>
              <td class="text-right">
                {{ item.spinCount }}
              </td>
              <td class="text-right">
                <q-icon
                  v-if="item.confirmed"
                  color="green-9"
                  size="42px"
                  name="done"
                />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
    <q-page-sticky
      position="top-left"
      :offset="[18, 18]"
    >
      <q-btn
        :disable="isNew || isNext !== undefined"
        @click="addNew"
        fab
        icon="add"
        color="red-6"
      />
    </q-page-sticky>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import Jackpot from '../components/Jackpot'
import { alerta } from 'src/helpers'
// import { alerta } from 'src/helpers'
export default {
  components: { Jackpot },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      items: [],
      jackpotRef: undefined,
      selected: false,
      newItem: undefined
    })
    const addNew = async () => {
      const newCycle = {
        id: -1,
        cycle: 0,
        prize: 0,
        state: 'next',
        repeated: 0,
        spinCount: 0,
        confirmed: 0
      }
      state.selected = newCycle
    }
    const isNew = computed(() => {
      return state.selected && state.selected.id === -1
    })
    const isNext = computed(() => {
      const _isNext = state.items.find(_item => {
        return _item.state === 'next'
      })
      return _isNext
    })
    const submit = async (data) => {
      if (data.state !== 'next') {
        state.selected = undefined
        return
      }
      try {
        const resp = await axios({
          method: 'post',
          url: '/slot/spin_data',
          data
        })
        if (isNew.value) {
          data.id = resp.data
          state.items.push(data)
        } else {
          const idxItem = state.items.findIndex(_item => _item.id === data.id)
          state.items[idxItem] = data
        }
        state.selected = undefined
      } catch (err) {
        await alerta(err)
      }
    }
    const cancel = async (data) => {
      if (data.id === -1) {
        const idxNew = state.items.findIndex(_item => _item.id === -1)
        if (idxNew !== -1) state.items.splice(idxNew, 1)
      }
      state.selected = undefined
    }
    const itemClass = (item) => {
      return item.state
    }
    const select = async (item) => {
      // if (item.state === 'past') {
      //   await alerta('A past cycle can not be modified')
      //   return
      // }
      state.selected = item
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/spin_data',
        method: 'get',
        params: {}
      })
      state.items = response.data
    }, { immediate: true })
    return { ...toRefs(state), submit, itemClass, select, isNew, addNew, cancel, isNext }
  }
}
</script>

<style lang="scss">
.past{
  color: black;
  background-color: rgb(246, 243, 243);
}
.live{
  color: green;
  background-color: rgb(230, 255, 206);
}
.next{
  color: white;
  background-color: rgba(233, 136, 112, 0.358)
}
.q-table{
  height: unset !important;
}
</style>
