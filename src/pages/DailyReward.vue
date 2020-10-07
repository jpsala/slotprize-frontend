
<template>
  <div class="q-pa-md row q-gutter-md justify-center">
    <DailyReward
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
          Daily Rewards
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
                Type
              </th>
              <th class="text-right">
                Amount
              </th>
              <th class="text-right remove-item" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item of items"
              :key="item.id"
              :class="itemClass(item)"
              class="cursor-pointer"
              @click="select(item, $event)"
            >
              <td class="text-left">
                {{ item.type }}
              </td>
              <td class="text-right">
                {{ item.amount }}
              </td>
              <td class="text-right remove-item">
                <q-icon
                  @click="removeItem(item)"
                  size="22px"
                  name="clear"
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
        :disable="isNew !== undefined"
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
import DailyReward from '../components/DailyReward'
import { alerta, confirma } from 'src/helpers'
// import { alerta } from 'src/helpers'
export default {
  components: { DailyReward },
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
        type: '',
        amount: 0
      }
      state.selected = newCycle
    }
    const isNew = computed(() => {
      return state.items.find(_item => _item.id === -1)
    })
    const submit = async (data) => {
      try {
        const resp = await axios({
          method: 'post',
          url: '/slot/daily_reward_for_crud',
          data
        })
        if (data.id === -1) {
          console.log('respre', resp)
          data.id = resp.data
          console.log('detalle', 1)
          state.items.push(Object.assign({}, data))
        } else {
          const idxItem = state.items.findIndex(_item => _item.id === data.id)
          state.items[idxItem] = data
        }
        state.selected = undefined
        console.log('detalle', resp.data)
      } catch (err) {
        await alerta(err)
      }
    }
    const cancel = async (data) => {
      if (data.id === -1) {
        const idxNew = state.items.findIndex(_item => _item.id === -1)
        state.items.splice(idxNew, 1)
      }
      state.selected = undefined
    }
    const itemClass = (item) => {
      console.log('items', item.state)
      return item.state
    }
    const select = async (item, event) => {
      if (event.target.tagName === 'I') return
      state.selected = item
      console.log('item', item)
    }
    const removeItem = async (item) => {
      const ok = await confirma('Are you sure?')
      if (ok) {
        const resp = await axios({
          method: 'delete',
          url: '/slot/daily_reward_for_crud',
          params: { id: item.id }
        })
        console.log('resp', resp)
        const itemForDelete = state.items.findIndex(_item => _item.id === item.id)
        state.items.splice(itemForDelete, 1)
        await alerta('Item removed')
      }
      console.log('item', item)
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/daily_reward_for_crud',
        method: 'get',
        params: {}
      })
      state.items = response.data
    }, { immediate: true })
    return { ...toRefs(state), submit, itemClass, select, isNew, addNew, cancel, removeItem }
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
.q-table tr{
  .remove-item {
    width: 40px!important;
    max-width: 40px!important;
    .q-icon{
      display: none;
      color: red;
    }
  }
  &:hover .q-icon{
    display: block;
    cursor: pointer;
  }
}
</style>
