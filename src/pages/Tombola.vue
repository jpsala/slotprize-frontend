<template>
  <q-page class="flex paytable">
    <div class="symbols">
      <Symbols @remove="removeSymbol"  @saveSymbol="saveSymbol" :items="symbols" :wrap="true"
               :show-menu="false" direction="column" :show-url="false" :show-paymant-type="false" symbol-size="50px"/>
    </div>
    <q-card class="table">
      <q-card-section>
      <div class="text-h6 text-center">Pay Table</div>
      </q-card-section>
      <q-separator class="q-mb-sm" />
      <q-card-section class="items-section small-scrollbars">
        <q-list separator>
            <q-item v-for="(item, index) of paytable" :key="index" clickable :class="{error: item.withError}"
                    @click="paytableRowClick(item, $event)" @mouseenter="hovered = item" @mouseleave="hovered = undefined">
                <q-item-section avatar>
                <q-icon v-if="!item.jackpot" @click="removePaymentTypeFromRow(item)"
                        :name="item.symbolId > -1 && hovered && hovered.id === item.id && !item.reel1 ? 'add_circle_outline':''" size="38px" />
                </q-item-section>
                <q-item-section avatar>
                <q-img v-show="item.reel1" :src="item.url" />
                </q-item-section>
                <q-item-section avatar>
                <q-img v-show="item.reel2" :src="item.url" />
                </q-item-section>
                <q-item-section avatar>
                <q-img v-show="item.reel3" :src="item.url" />
                </q-item-section>
                <q-icon v-if="!item.jackpot" @click="addPaymentTypeToRow(item)"  size="38px"
                        :name="item.symbolId >= 0 && hovered && hovered.id === item.id && item.reel2 ? 'remove_circle_outline':''"/>
                <q-item-section v-if="item.jackpot" style="font-weight: bolder" side>
                  <q-input dense flat borderless @change="paytableInputChange(item, 'p', $event)"
                           :value="item.points" style="margin-left: 35px;width: 45px">
                  </q-input>
                </q-item-section>
                <q-item-section side v-else>
                  <div class="row on-right">
                        <q-input dense flat :borderless="false" class="col self-end"
                          @change="paytableInputChange(item, 'p', $event)" :value="item.points"
                          style="width: 75px" suffix="Points">
                        </q-input>
                        <q-input dense flat :borderless="false" class="col q-ml-sm self-end" suffix="%"
                          @change="paytableInputChange(item, 'r', $event)" :value="item.probability"
                          style="width:75px">
                        </q-input>
                  </div>
                  </q-item-section>
                <q-item-section avatar>
                  <q-icon @click="removeItemFromPaytable(item)" name="highlight_off" size="40px" color="red-6"
                          v-if="!item.jackpot &&hovered && item.id === hovered.id" />
                  </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <span style="font-size: 1.3rem">Total probabilities</span>
              </q-item-section>
              <q-item-section :class="{error: totalProbability !== 100}">
                <q-input dense flat borderless readonly class="self-end"
                  :value="totalProbability" style="width:60px; margin-right: 15px;text-align: right">
                </q-input>
              </q-item-section>
                <q-item-section avatar>
                </q-item-section>
            </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-page-sticky position="top-left" :offset="[358, 18]">
      <q-btn :disable="thereIsANewItem" fab icon="add" color="red" @click="addRow"/>
    </q-page-sticky>
    <q-page-sticky position="top-left" :offset="[288, 18]">
      <q-btn :disable="!tableIsValid" fab icon="save" color="green-8" @click="save"/>
    </q-page-sticky>
    <SymbolSelect @close="symbolSelect" :symbols="symbols" :active="symbolSelectActive" />
  </q-page>
</template>

<script>
import { onMounted, reactive, toRefs, computed, watch } from '@vue/composition-api'
import Symbols from '../components/Symbols'
import SymbolSelect from '../components/SymbolSelect'
import { getTombolaData } from '../services/slot'
import axios from '../services/axios'
import { rand } from 'src/helpers'

export default {
  components: { Symbols, SymbolSelect },

  setup (_, { root }) {
    const state = reactive({
      symbols: [],
      tableData: [],
      paytable: [],
      jackpot: false,
      itemDraggingOver: undefined,
      symbolSelectActive: false,
      hovered: undefined,
      thereIsANewItem: false,
      withError: false,
      totalProbability: 0
    })
    const saveSymbol = (symbol) => {
      const idx = state.symbols.findIndex(_symbol => _symbol.id === Number(symbol.id))
      if (idx < 0) state.symbols.push(symbol)
      else state.symbols[idx] = symbol
    }
    const removeSymbol = (symbol) => {
      root.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to remove this symbol?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const idx = state.symbols.findIndex(_symbol => _symbol.id === symbol.id)
        if (idx) {
          await axios({ method: 'delete', url: '/slot/symbol', params: { id: symbol.id } })
          state.symbols.splice(idx, 1)
        }
      })
    }
    const symbolSelect = (symbol) => {
      if (symbol) {
        const tableDataIdx = state.tableData.findIndex(tdRow => tdRow.symbol.textureUrl === state.selectedPaytableItemForChange.url)
        console.log('state.tableData[tableDataIdx]', state.tableData[tableDataIdx])
        if (symbol.paymentType === 'jackpot') {
          const jackpotExists = state.tableData.find(tdRow => tdRow.jackpot)
          if (jackpotExists) {
            console.log('state.tableData[tableDataIdx]', state.tableData[jackpotExists])
            alert('jackpot already exists')
            state.symbolSelectActive = undefined
            state.selectedPaytableItemForChange = undefined
            return
          }
          state.tableData[tableDataIdx].jackpot = true
          state.tableData[tableDataIdx].probability = 0
        } else {
          state.tableData[tableDataIdx].jackpot = false
        }
        state.tableData[tableDataIdx].symbol = symbol
        state.tableData[tableDataIdx].symbolId = symbol.id
      }
      state.symbolSelectActive = undefined
      state.selectedPaytableItemForChange = undefined
    }
    const paytableRowClick = (item, event) => {
      if (!event.target.classList.contains('q-img__content') &&
         !event.target.classList.contains('q-item__section--avatar')) return
      state.symbolSelectActive = true
      state.selectedPaytableItemForChange = item
    }
    const paytableInputChange = (item, property, event) => {
      const tableDataItem = state.tableData.find(tdRow => tdRow.id === item.id)
      tableDataItem.url = ''
      tableDataItem[property === 'p' ? 'points' : 'probability'] = event.target.value
    }
    const removePaymentTypeFromRow = (item) => {
      addRemovePaymentTypeFromRow(item, 1)
    }
    const addPaymentTypeToRow = (item) => {
      addRemovePaymentTypeFromRow(item, -1)
    }
    const addRemovePaymentTypeFromRow = (paytableRow, cant) => {
      if ((cant > 0 && paytableRow.reel1) || (cant < 0 && !paytableRow.reel2)) return
      const savedPaytableRow = state.tableData.find(tdRow => tdRow.id === paytableRow.id)
      savedPaytableRow.symbolAmount += cant
    }
    const removeItemFromPaytable = (item) => {
      const idx = state.tableData.findIndex(tdRow => tdRow.id === item.id)
      if (idx) state.tableData.splice(idx, 1)
    }
    const checkDuplicatedRow = (tdRowBeenChecked) => {
      let isDuplicated = false
      state.tableData
        .filter(tdRow =>
          tdRow.symbol.paymentType === tdRowBeenChecked.symbol.paymentType &&
            tdRow.symbolAmount === tdRowBeenChecked.symbolAmount &&
            tdRow.id !== tdRowBeenChecked.id)
        .forEach(dup => {
          dup.withError = true
          state.withError = true
          isDuplicated = true
        })
      return isDuplicated
    }
    const save = async () => {
      try {
        const resp = await axios.post('slot/tombola_for_crud', state.tableData)
        if (resp.data.status === 'ok') alert('Saved')
        else alert('Error saving ' + resp.data)
        console.log('save', resp)
      } catch (error) {
        alert('Error saving data ' + error)
      }
    }
    const addRow = () => {
      state.tableData.push(
        {
          new: true,
          id: rand(1, 10000),
          points: 0,
          probability: 0,
          symbol: { id: -1, paymentType: '', textureUrl: '' },
          paymentType: 1,
          textureUrl: 1,
          symbolAmount: 1,
          symbolId: -1,
          withError: true
        }
      )
    }
    watch(() => state.tableData, () => {
      console.log('tableData watch')
      state.thereIsANewItem = false
      state.withError = false
      state.totalProbability = 0
      for (const row of state.tableData) {
        const isNewRow = row.symbolId === -1
        const probabilityZeroRow = Number(row.probability) === 0
        const zeroPointsRow = Number(row.points) === 0
        const jackpotRow = row.symbol.paymentType === 'jackpot'
        const duplicatedRow = checkDuplicatedRow(row)
        state.totalProbability += Number(row.probability)
        if (isNewRow) state.thereIsANewItem = true
        if ((probabilityZeroRow || isNewRow || zeroPointsRow || duplicatedRow) && !jackpotRow) {
          state.withError = true
          row.withError = true
        } else row.withError = false
      }
      state.paytable = state.tableData
        .map(pt => {
          console.log('paytable computed', pt)
          return {
            id: pt.id,
            symbolId: pt.symbol.id,
            reel3: pt.symbolAmount > 0,
            reel2: pt.symbolAmount > 1,
            reel1: pt.symbolAmount > 2,
            points: pt.points,
            withError: pt.withError,
            probability: pt.probability,
            url: pt.symbol.textureUrl,
            jackpot: pt.symbol.paymentType === 'jackpot'
          }
        }).sort((a, b) => {
          if (Number(a.probability) < Number(b.probability)) { return -1 }
          if (Number(a.probability) > Number(b.probability)) { return 1 }
          return 0
        })
    }, { deep: true, inmediate: true })
    onMounted(async () => {
      const tombolaData = await getTombolaData()
      state.symbols = tombolaData.symbols
      state.tableData = tombolaData.paytable/* .map(ptRow => Object.assign(ptRow, { withError: true })) */
    })
    const tableIsValid = computed(() =>
      !state.thereIsANewItem && state.totalProbability === 100 && !state.withError
    )
    return {
      ...toRefs(state),
      saveSymbol,
      removeSymbol,
      paytableRowClick,
      symbolSelect,
      paytableInputChange,
      removePaymentTypeFromRow,
      addPaymentTypeToRow,
      addRow,
      removeItemFromPaytable,
      save,
      tableIsValid
    }
  }
}
</script>

<style lang="scss">
@import '../css/app.sass';
.inner-border {
       background-color: rgb(236, 243, 236);
    }
.paytable{
    display: flex;
    flex-direction: row;
    input{
      text-align: right;
    }
    .table{
        // width: 100%;
        min-width: 200px;
        margin: 10px auto auto 15%;
        // background-color: rgba(250, 250, 210, 0.404);
        padding: 10px;
        box-shadow: 0 1px 1px rgba(0,0,0,0.12),
              0 2px 2px rgba(0,0,0,0.12),
              0 4px 4px rgba(0,0,0,0.12),
              0 8px 8px rgba(0,0,0,0.12),
              0 16px 16px rgba(0,0,0,0.12);
    }
    .q-item{
      cursor: pointer;
    }
    .error {
      background-color: rgba(255, 0, 0, 0.164) !important;
      color: white;
      border-radius: 10px;
    }
}
</style>
