<template>
  <div class="q-pa-md q-gutter-md justify-center">
    <h3 class="q-ml-xl q-pl-xl">Winners List</h3>
      <div class="row">
        <date-picker v-model="dateFrom" :showTime="false" label="From Date" />
        <date-picker v-model="dateTo" :showTime="false" label="To Date" />
        <q-select label="Status" class="col-2"
                stack-label v-model="statusSelected" :options="['All',...statuses]"/>
      </div>
      <div class="row" v-if="checkedAll !== false">
          <div class="row">
            <span  style="margin: auto 0 auto 0; width:240px">Change status of selected winners to </span>
            <q-select class="q-ml-md" dense style="width:150px"
                    v-model="statusForSelected" :options="statuses"/>
          </div>
        <q-btn class="col-1 q-ml-md" color="primary" dense @click="changeSelectedStatus" label="Change"/>
      </div>
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
        <tr v-for="(item, index) of filteredItems" :key="index">
          <td class="text-left td-date"><q-checkbox v-model="item.checked" /></td>
          <td class="text-left td-date">{{item.date}}</td>
          <td class="text-left">{{item.prize}}</td>
          <!-- <td class="text-left td-description">{{item.description}}</td> -->
          <td class="text-left">{{item.origin}}</td>
          <td class="text-left">
            <q-select dense v-model="item.state" :options="statuses" @input="changeStatus(item)"/>
          </td>
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
// eslint-disable-next-line no-unused-vars
import { format, parseISO, parse } from 'date-fns'
import DatePicker from '../components/DatePicker.vue'
import { confirma } from 'src/helpers'
export default {
  components: { DatePicker },
  setup () {
    const { loggedIn } = useSession()
    const state = reactive({
      items: [],
      dateFrom: '',
      dateTo: format(new Date(), 'yyyy-MM-dd'),
      statusSelected: 'All',
      statuses: ['won', 'notified', 'delivered'],
      statusForSelected: 'delivered',
      checkedAll: computed(() => {
        const _checked = state.items.filter(i => i.checked)
        if (_checked.length === state.items.length) return true
        else if (_checked.length > 0) return undefined
        return false
      }, { deep: true }),
      checkItem (item) {
        item.checked = !item.checked
      },
      filteredItems: computed(() => {
        return state.items.filter((row) => {
          if (state.statusSelected !== 'All' && row.state !== state.statusSelected) return false
          const rowDate = parse(row.date, 'yyyy-MM-dd', new Date())
          const dateFrom = parse(state.dateFrom, 'yyyy-MM-dd', new Date())
          const dateTo = parse(state.dateTo, 'yyyy-MM-dd', new Date())
          return rowDate >= dateFrom && rowDate <= dateTo
        })
      }),
      toggleCheckAll () {
        console.log('state', state)
        if (state.checkedAll || state.checkedAll === undefined) {
          console.log('detalle')
          state.items.forEach(i => { i.checked = false })
        } else { state.items.forEach(i => { i.checked = true }) }
      },
      async changeStatus (item) {
        await state.submitChangeStatus([item], item.state)
        console.log('item', item)
      },
      async submitChangeStatus (items, newState) {
        console.log('submitStatus', items)
        await axios.post('/slot/change_winners_status_for_crud', {
          items, state: newState
        })
        for (const item of items) {
          const arrayItem = state.items.find(_item => _item.id === item.id && _item.origin === item.origin)
          arrayItem.state = newState
          arrayItem.checked = false
        }
      },
      async changeSelectedStatus () {
        const selectedCount = state.filteredItems.reduce((count, _item) => {
          return _item.checked ? count + 1 : count
        }, 0)
        if (await confirma(`Change the ${selectedCount} selected items to ${state.statusForSelected}`)) {
          await state.submitChangeStatus(state.filteredItems.filter(_item => _item.checked), state.statusForSelected)
        }
      }
    })
    watch(() => loggedIn, async () => {
      const response = await axios.get('/slot/winners_for_crud')
      response.data.forEach((i, idx) => {
        if (idx === response.data.length - 1) state.dateFrom = format(parse(i.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
        if (idx === 0) state.dateTo = format(parse(i.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
        i.checked = false
      })
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
