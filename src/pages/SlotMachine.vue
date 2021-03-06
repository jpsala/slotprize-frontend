<template>
  <q-page class="flex paytable">
    <div class="symbols">
      <Symbols @remove="removeSymbol" :pay-table="paytable" @save-symbol="saveSymbol" :items="symbols" :wrap="true" :show-menu="false" direction="column" :show-url="false" :show-paymant-type="false" symbol-size="50px" />
    </div>
    <q-card v-show="paytable.length" class="table">
      <q-card-section>
        <div class="text-h6 text-center">
          Pay Table
        </div>
      </q-card-section>
      <q-separator class="q-mb-sm" />
      <q-card-section class="items-section small-scrollbars">
        <q-list separator>
          <q-item style="width: 100%;">
            <div class="row">
              <q-input class="col" outlined @input="winInputChange" dense label="Win" v-model="win" />
              <q-input class="col" readonly outlined label="Lose" dense :value="lose" />
              <q-btn color="primary" icon="check" label="OK" @click="saveWinLose" :disable="(Number(win) < 1 || Number(win) > 100 ||
                  Number(lose) < 1 || Number(lose) > 100) || !winLoseDirty" />
            </div>
          </q-item>
          <q-item v-for="item of paytable" :key="item.id" clickable :class="{error: item.withError}" @click="paytableRowClick(item, $event)" @mouseenter="hovered = item" @mouseleave="hovered = undefined">
            <q-item-section avatar>
              <q-icon v-if="!item.jackpot" @click="removePaymentTypeFromRow(item)" :name="item.symbolId > -1 && hovered && hovered.id === item.id && !item.reel1 ? 'add_circle_outline':''" size="38px" />
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
            <q-icon v-if="!item.jackpot" @click="addPaymentTypeToRow(item)" size="38px" :name="item.symbolId >= 0 && hovered && hovered.id === item.id && item.reel2 ? 'remove_circle_outline':''" />
            <q-item-section v-if="item.jackpot" style="font-weight: bolder" side>
              <q-input readonly dense flat borderless @change="paytableInputChange(item, 'p', $event)" :value="item.points" style="margin-left: 35px;width: 45px" />
            </q-item-section>
            <q-item-section side v-else>
              <div class="row on-right">
                <q-input dense flat :borderless="false" class="col self-end" @change="paytableInputChange(item, 'p', $event)" @focus="changeFocus" :value="item.points" style="width: 75px" :suffix="Number(item.points) > 1 ? item.paymentType+'s' : item.paymentType" />
                <q-input dense flat :borderless="false" class="col q-ml-sm self-end" suffix="%" @change="paytableInputChange(item, 'r', $event)" :value="item.probability" style="width:75px" />
              </div>
            </q-item-section>
            <q-item-section avatar>
              <q-icon @click="removeItemFromPaytable(item)" name="highlight_off" size="40px" color="red-6" v-if="!item.jackpot &&hovered && item.id === hovered.id" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <span style="font-size: 1.3rem">Total probabilities</span>
            </q-item-section>
            <q-item-section :class="{error: totalProbability !== 100}">
              <q-input dense flat borderless readonly class="self-end" :value="totalProbability" suffix="%" style="width:80px; margin-right: 15px;text-align: right" />
            </q-item-section>
            <q-item-section avatar />
          </q-item>
          <q-item v-if="totalProbability !== 100">
            <q-item-section>
              <span style="font-size: 1.3rem">Diff</span>
            </q-item-section>
            <q-item-section :class="{error: totalProbability !== 100}">
              <q-input dense flat borderless readonly class="self-end" :value="totalProbability - 100" suffix="%" style="width:80px; margin-right: 15px;text-align: right" />
            </q-item-section>
            <q-item-section avatar />
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
    <q-page-sticky v-show="paytable.length" position="top-left" :offset="[308, 18]">
      <q-btn :disable="thereIsANewItem" fab icon="add" color="red" @click="addRow" />
    </q-page-sticky>
    <q-page-sticky v-show="paytable.length" position="top-left" :offset="[248, 18]">
      <q-btn :disable="!tableIsValid" fab icon="save" color="green-8" @click="save" />
    </q-page-sticky>
    <SymbolSelect @close="symbolSelect" :symbols="symbols" :active="symbolSelectActive" />
    <h4 v-show="!paytable.length" class="q-ma-xl">
      Loading...
    </h4>
  </q-page>
</template>

<script>
import { onMounted, reactive, toRefs, computed, watch, onUnmounted } from '@vue/composition-api'
import Symbols from '../components/Symbols'
import SymbolSelect from '../components/SymbolSelect'
import { getTombolaData } from '../services/slot'
import axios from '../services/axios'
import { rand, alerta, resizeObserver } from 'src/helpers'
import useGlobal from '../services/useGlobal'

export default {
  components: { Symbols, SymbolSelect },

  setup (_, { root }) {
    const { showSpinner, hideSpinner } = useGlobal()
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
      totalProbability: 0,
      win: 0,
      lose: 0,
      winLoseDirty: false,
      focused: undefined
    })
    const saveSymbol = (symbol) => {
      const idx = state.symbols.findIndex(_symbol => Number(_symbol.id) === Number(symbol.id))
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
          showSpinner()
          await axios({ method: 'delete', url: '/slot/symbol', params: { id: symbol.id } })
          state.symbols.splice(idx, 1)
          hideSpinner()
        }
      })
    }
    const paytableRowClick = (item, event) => {
      if (!event.target.classList.contains('q-img__content') &&
         !event.target.classList.contains('q-item__section--avatar')) return
      state.symbolSelectActive = true
      state.selectedPaytableItemForChange = state.tableData.find(tdRow => tdRow.id === item.id)
    }
    const symbolSelect = async (symbol) => {
      const clean = () => {
        state.symbolSelectActive = undefined
        state.selectedPaytableItemForChange = undefined
      }
      if (symbol) {
        if (state.selectedPaytableItemForChange.jackpot && symbol.textureUrl !== 'jackpot') {
          alerta('Jackpot only row', 'In this row only a symbol named "jackpot" can be used')
          clean()
          return
        }
        if (symbol.paymentType === 'jackpot') {
          const jackpotExists = state.tableData.find(tdRow => tdRow.jackpot)
          if (jackpotExists) {
            await alerta('jackpot already exists', 'There can only be one jackpot row')
            clean()
            return
          }
          state.selectedPaytableItemForChange.jackpot = true
          state.selectedPaytableItemForChange.probability = -1
        } else {
          state.selectedPaytableItemForChange.jackpot = false
        }
        state.selectedPaytableItemForChange.symbol = symbol
        state.selectedPaytableItemForChange.symbolId = symbol.id
      }
      clean()
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
          tdRow.symbol.symbolName === tdRowBeenChecked.symbol.symbolName &&
            tdRow.symbolAmount === tdRowBeenChecked.symbolAmount &&
            tdRow.id !== tdRowBeenChecked.id)
        .forEach(dup => {
          dup.withError = true
          state.withError = true
          isDuplicated = true
        })
      return isDuplicated
    }
    const paytableResize = async (e) => {
      console.warn('resize', e)
    }
    const save = async () => {
      showSpinner()
      try {
        const resp = await axios.post('slot/tombola_for_crud', state.tableData)
        hideSpinner()
        if (resp.data.status === 'ok') alerta('Saved')
        else alerta('Error saving ' + resp.data)
      } catch (error) {
        hideSpinner()
        alerta('Error saving data ' + error)
      } finally {
        hideSpinner()
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
    const winInputChange = () => {
      console.log('win', state.win)
      state.lose = 100 - Number(state.win)
      state.winLoseDirty = true
    }
    const saveWinLose = async () => {
      await axios.post('/slot/win_lose_for_tombola_crud', { win: Number(state.win), lose: Number(state.lose) })
      state.winLoseDirty = false
    }
    const changeFocus = (e) => {
      let el = e.target
      if (el.tagName === 'DIV') { el = el.querySelector('input') }
      state.focused = el
      console.log('el', el)
    }
    watch(() => state.tableData, () => {
      const focusedEl = document.activeElement
      console.log('focused', focusedEl)
      state.thereIsANewItem = false
      state.withError = false
      state.totalProbability = 0
      for (const row of state.tableData) {
        const isNewRow = row.symbolId === -1
        const isProbabilityZeroRow = Number(row.probability) === 0
        const isZeroPointsRow = Number(row.points) === 0
        const isJackpotRow = row.symbol.paymentType === 'jackpot'
        const isDuplicatedRow = checkDuplicatedRow(row)
        state.totalProbability += Number(row.probability)
        if (isNewRow) state.thereIsANewItem = true
        if (isJackpotRow) row.jackpot = true
        if ((isProbabilityZeroRow || isNewRow || isZeroPointsRow || isDuplicatedRow) && !isJackpotRow) {
          state.withError = true
          row.withError = true
        } else row.withError = false
      }
      state.paytable = state.tableData
        .map(pt => {
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
            jackpot: pt.symbol.paymentType === 'jackpot',
            paymentType: pt.symbol.paymentType
          }
        }).sort((a, b) => {
          let aSortValue = a.points
          if (a.jackpot) aSortValue = 30000000
          else if (a.paymentType.toUpperCase() === 'SPIN') aSortValue = 20000000
          else if (a.paymentType.toUpperCase() === 'TICKET') aSortValue = 10000000
          else if (a.paymentType.toUpperCase() === 'CARD') aSortValue = 9000000

          let bSortValue = b.points
          if (b.jackpot) bSortValue = 30000000
          else if (b.paymentType.toUpperCase() === 'SPIN') bSortValue = 20000000
          else if (b.paymentType.toUpperCase() === 'TICKET') bSortValue = 10000000
          else if (b.paymentType.toUpperCase() === 'CARD') bSortValue = 9000000

          if (Number(aSortValue) > Number(bSortValue)) { return -1 }
          if (Number(aSortValue) < Number(bSortValue)) { return 1 }
          return 0
        })
      setTimeout(() => {
        state.focused.focus()
        console.log('state.q-field--focuseds', state.focused)
      }, 100)
    }, { deep: true, inmediate: true })
    onUnmounted(() => {
      // const listEl = document.querySelector('.items-section .q-list')
      // listEl.removeEventListener('resize', listResize)
    })

    onMounted(async () => {
      showSpinner()
      const tombolaData = await getTombolaData()
      const listEl = document.querySelector('.items-section .q-list')
      const symbolsEl = document.querySelector('.items')
      const listObserver = resizeObserver(listEl, (event) => {
        symbolsEl.style.maxHeight = event.height + 130 + 'px'
      })
      listObserver.observe(listEl)
      state.symbols = tombolaData.symbols
      state.win = 100 - tombolaData.spinLosePercent
      state.lose = tombolaData.spinLosePercent
      state.tableData = tombolaData.paytable/* .map(ptRow => Object.assign(ptRow, { withError: true })) */
      hideSpinner()
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
      tableIsValid,
      paytableResize,
      winInputChange,
      saveWinLose,
      changeFocus
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
    // .q-item{
    //   cursor: pointer;
    // }
    .error {
      background-color: rgba(252, 22, 22, 0.68) !important;
      color: white;
      border-radius: 5px;
      input, .q-field__suffix, i{
        color: white !important;
      }
    }
}
</style>
