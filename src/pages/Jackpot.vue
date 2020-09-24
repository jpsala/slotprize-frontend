
<template>
    <div class="q-pa-md row q-gutter-md justify-center">
      <Jackpot ref="jackpotRef" :item="selected" :show="Boolean(selected)" @onsubmit="submit" />
      <q-card bordered class="my-card">
        <q-card-section class="bg-primary text-white" style="width: 400px">
          <div class="text-h6">Jackpot Data</div>
        </q-card-section>

        <q-separator dark inset />
        <q-card-section>
          <q-markup-table flat square>
            <thead>
              <tr>
                <th class="text-left">Cycle</th>
                <th class="text-right">Prize</th>
                <th class="text-left">State</th>
                <th class="text-right">Spin Count</th>
                <th class="text-left">Confirmed</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item of items" :key="item.id" :class="itemClass(item)"
                  class="cursor-pointer" @click="select(item)">
                <td class="text-left">{{item.cycle}}</td>
                <td class="text-right">{{item.prize}}</td>
                <td class="text-left">{{item.state}}</td>
                <td class="text-right">{{item.spinCount}}</td>
                <td class="text-right"><q-icon v-if="item.confirmed" color="green-9" size="42px" name="done"/></td>
              </tr>
            </tbody>
          </q-markup-table>
      </q-card-section>
      <q-card-actions align="right">
        <!-- <q-btn flat>Action 1</q-btn> -->
        <q-btn @click="submit" flat>Submit</q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
import Jackpot from '../components/Jackpot'
export default {
  components: { Jackpot },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      items: [],
      jackpotRef: undefined,
      selected: false
    })
    const submit = async (data) => {
      const resp = await axios({
        method: 'post',
        url: '/slot/spin_data',
        data
      })
      state.selected = undefined
      console.log('detalle', resp.data)
    }
    const itemClass = (item) => {
      console.log('items', item.state)
      return item.state
    }
    const select = (item) => {
      state.selected = item
      console.log('item', item)
    }
    watch(() => loggedIn, async () => {
      const response = await axios({
        url: '/slot/spin_data',
        method: 'get',
        params: {}
      })
      state.items = response.data
    }, { immediate: true })
    return { ...toRefs(state), submit, itemClass, select }
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
