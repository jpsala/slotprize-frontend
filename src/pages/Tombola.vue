<template>
  <q-page class="flex paytable">
      <div class="symbols">
        <Symbols @remove="removeSymbol"  @saveSymbol="saveSymbol" :items="symbols" :wrap="true" :show-menu="false" direction="column"
                            :show-url="false" :show-paymant-type="false" symbol-size="50px"/>
      </div>
      <q-card class="table" >
        <q-card-section>
        <div class="text-h6 text-center">Pay Table</div>
        </q-card-section>
        <q-separator class="q-mb-sm" />
        <q-card-section class="items-section small-scrollbars">
            <q-list  separator>
                <q-item v-for="(item, index) of paytable" :key="index" clickable
                        @click="paytableClick(item, $event)">
                    <q-item-section avatar>
                    <q-img v-show="item.reel1" :src="item.url" />
                    </q-item-section>
                    <q-item-section avatar>
                    <q-img v-show="item.reel2" :src="item.url" />
                    </q-item-section>
                    <q-item-section avatar>
                    <q-img v-show="item.reel3" :src="item.url" />
                    </q-item-section>
                    <q-item-section v-if="item.jackpot" style="font-weight: bolder" side>
                            <q-input dense flat borderless class="col q-ml-sm self-end" filled
                              @change="itemInput(item, 'p', $event)" :value="item.points"
                              style="width: 61px; margin-left: 19px">
                            </q-input>
                    </q-item-section>
                    <q-item-section side v-else>
                      <div class="row on-right">
                            <q-input dense flat borderless class="col q-ml-sm self-end" filled
                              @change="itemInput(item, 'p', $event)" :value="item.points"
                              style="width: 45px">
                            </q-input>
                            <q-input dense flat borderless class="col q-ml-sm self-end" filled
                              @change="itemInput(item, 'r', $event)" :value="item.probability"
                              style="width:75px">
                            </q-input>
                      </div>
                      </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <span style="font-size: 1.3rem">Total probabilities</span>
                  </q-item-section>
                  <q-item-section :class="{error: totalProbability !== 100}">
                    <q-input dense flat borderless filled readonly
                      :value="totalProbability" style="width:60px; margin-right: 15px;text-align: right" class="self-end">
                    </q-input>
                  </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
      </q-card>
      <SymbolSelect @close="symbolSelectClose" :symbols="symbols" :active="symbolSelectActive" />
  </q-page>
</template>

<script>
import { onMounted, reactive, toRefs, computed } from '@vue/composition-api'
import Symbols from '../components/Symbols'
import SymbolSelect from '../components/SymbolSelect'
import { getTombolaData } from '../services/slot'
import axios from '../services/axios'

export default {
  components: { Symbols, SymbolSelect },

  setup (_, { root }) {
    const state = reactive({
      symbols: [],
      tableData: [],
      jackpot: {},
      itemDraggingOver: undefined,
      symbolSelectActive: false
    })
    const saveSymbol = (symbol) => {
      const idx = state.symbols.findIndex(_symbol => _symbol.id === Number(symbol.id))
      if (idx < 0) state.symbols.push(symbol)
      else state.symbols[idx] = symbol
    }
    const paytableClick = (item, event) => {
      console.log('event.target', event.target.classList, event.target.classList.contains('q-item__section--avatar'))
      if (!event.target.classList.contains('q-img__content') &&
         !event.target.classList.contains('q-item__section--avatar')) return
      state.symbolSelectActive = true
      state.selectedPaytableItemForChange = item
    }
    const symbolSelectClose = (symbol) => {
      if (symbol) {
        const tableDataIdx = state.tableData.findIndex(tdRow => tdRow.symbol.textureUrl === state.selectedPaytableItemForChange.url)
        state.tableData[tableDataIdx].symbol = symbol
      }
      state.symbolSelectActive = undefined
      state.selectedPaytableItemForChange = undefined
    }
    const itemInput = (item, property, event) => {
      console.log(event)
      const tableDataItem = state.tableData.find(tdRow => tdRow.symbol.id === item.symbolId)
      tableDataItem.url = ''
      tableDataItem[property === 'p' ? 'points' : 'probability'] = event.target.value
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
    const totalProbability = computed(() => {
      const total = state.tableData.reduce((prev, current) => {
        console.log(prev, current)
        return prev + Number(current.probability)
      }, 0)
      return total
    })
    const paytable = computed(() => state.tableData
      .map(pt => {
        return {
          symbolId: pt.symbol.id,
          reel3: pt.symbolAmount > 0,
          reel2: pt.symbolAmount > 1,
          reel1: pt.symbolAmount > 2,
          points: pt.points,
          probability: pt.probability,
          url: pt.symbol.textureUrl,
          jackpot: pt.symbol.paymentType === 'jackpot'
        }
      }).sort((a, b) => {
        if (Number(a.probability) < Number(b.probability)) { return -1 }
        if (Number(a.probability) > Number(b.probability)) { return 1 }
        return 0
      }), { deep: true }
    )
    onMounted(async () => {
      const tombolaData = await getTombolaData()
      state.symbols = tombolaData.symbols
      state.tableData = tombolaData.paytable
    })
    return {
      ...toRefs(state),
      saveSymbol,
      removeSymbol,
      paytable,
      paytableClick,
      symbolSelectClose,
      itemInput,
      totalProbability
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
    .error *{
      background-color: rgb(240, 69, 69);
      color: white;
    }
}
</style>
