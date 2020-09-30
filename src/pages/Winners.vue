<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Winners List</h3>
      <q-markup-table wrap-cells>
      <thead>
        <tr>
          <th class="text-left td-check"><q-checkbox @input="toggleCheckAll" :value="checkedAll"></q-checkbox></th>
          <th class="text-left td-date">Date</th>
          <!-- <th class="text-left td-description">Description</th> -->
          <th class="text-left td-description">Prize</th>
          <th class="text-left">Origin</th>
          <th class="text-left">Status</th>
          <th class="text-left">User ID</th>
          <th class="text-left">User Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) of items" :key="index">
          <td class="text-left td-date"><q-checkbox @input="checkItem(item)" :value="item.checked" /></td>
          <td class="text-left td-date">{{item.date}}</td>
          <td class="text-left">{{item.name}}</td>
          <!-- <td class="text-left td-description">{{item.description}}</td> -->
          <td class="text-left">{{item.origin}}</td>
          <td class="text-left">{{item.state}}</td>
          <td class="text-left">{{item.userId}}</td>
          <td class="text-left"><router-link :to="{ path: '/player', query: { player: item.userId } }">{{item.user}}</router-link> | {{item.email}}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import { reactive, toRefs, watch, computed } from '@vue/composition-api'
import useSession from 'src/services/useSession'
import axios from '../services/axios'
export default {
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      items: [],
      checkedAll: computed(() => {
        const _checked = state.items.filter(i => i.checked)
        if (_checked.length === state.items.length) return true
        else if (_checked.length > 0) return undefined
        return false
      }, { deep: true }),
      checkItem (item) {
        console.log('detalle', item)
        item.checked = !item.checked
      },
      toggleCheckAll () {
        console.log('state', state)
        if (state.checkedAll || state.checkedAll === undefined) {
          console.log('detalle')
          state.items.forEach(i => { i.checked = false })
        } else { state.items.forEach(i => { i.checked = true }) }
      }
    })
    watch(() => loggedIn, async () => {
      const response = await axios.get('/slot/winners_for_crud')
      response.data.forEach(i => { i.checked = true })
      state.items = response.data
    }, { immediate: true })
    return { ...toRefs(state) }
  }
}
</script>

<style lang="scss">
  .td-date{
    // max-width: 100px;
    width: 98px;
  }
  .td-description{
    width: 380px;
  }
</style>
