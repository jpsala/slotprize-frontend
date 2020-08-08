<template>
  <q-page class="flex pay-table">
      <div class="symbols">
        <Symbols :items="symbols" :wrap="true" :show-menu="false" direction="column"
                            :show-url="false" :show-paymant-type="false" symbol-size="50px"/>
      </div>
      <q-card class="table" @drop='onDrop($event, 1)' @dragover.prevent @dragenter.prevent
                    >
        <q-card-section>
        <div class="text-h6 text-center">Pay Table</div>
        </q-card-section>
        <q-separator class="q-mb-sm" />
        <q-card-section class="items-section small-scrollbars">
            <q-list  separator>
                <q-item v-ripple clickable="" v-for="(item, index) of tableData" :key="index">
                    <q-item-section avatar @dragover="onDragover(1, item, $event.target)"
                        @dragleave="onDragleave($event.target)"
                        @click="onClick(1, item, $event.target)">
                    <q-img v-show="item.reel1" :src="item.url" />
                    </q-item-section>
                    <q-item-section avatar @dragover="onDragover(2, item, $event.target)"
                        @dragleave="onDragleave($event.target)"
                        @click="onClick(2, item, $event.target)">
                    <q-img v-show="item.reel2" :src="item.url" />
                    </q-item-section>
                    <q-item-section avatar @dragover="onDragover(3, item, $event.target)"
                        @dragleave="onDragleave($event.target)"
                        @click="onClick(3, item, $event.target)">
                    <q-img v-show="item.reel3" :src="item.url" />
                    </q-item-section>
                    <q-item-section style="font-weight: bolder" side v-if="item.jackpot"
                        @dragleave="onDragleave($event.target)">
                        <span style="font-size: 130%">{{item.jackpot}}€</span>
                    </q-item-section>
                    <q-item-section side v-else>{{item.points}} Pts </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>

      </q-card>
  </q-page>
</template>

<script>
/* eslint-disable dot-notation */
import { onMounted, reactive, toRefs } from '@vue/composition-api'
import Symbols from '../components/Symbols'
import { getSymbols } from '../services/slot'

export default {
  components: { Symbols },

  setup () {
    const state = reactive({
      symbols: [],
      tableData: [
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/apple.png',
          reel1: true,
          reel2: true,
          reel3: true,
          points: '1000',
          jackpot: '1000 '
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/cat_sticer.png',
          reel1: true,
          reel2: true,
          reel3: true,
          points: '100'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/eggs.png',
          reel1: true,
          reel2: true,
          reel3: true,
          points: '80'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/berries.png',
          reel1: false,
          reel2: true,
          reel3: true,
          points: '80'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/porcini.png',
          reel1: false,
          reel2: true,
          reel3: true,
          points: '50'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/fried_eggs.png',
          reel1: false,
          reel2: true,
          reel3: true,
          points: '70'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/fried_eggs.png',
          reel1: false,
          reel2: true,
          reel3: true,
          points: '20'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/fried_eggs.png',
          reel1: false,
          reel2: false,
          reel3: true,
          points: '10'
        },
        {
          url: 'http://wopidom.homelinux.com/public/assets/symbols/food/fried_eggs.png',
          reel1: false,
          reel2: false,
          reel3: true,
          points: '10'
        }
      ],
      itemDraggingOver: undefined
    })
    const onDrop = (evt, list) => {
      console.log('onDrop', evt, list)
      const item = JSON.parse(evt.dataTransfer.getData('item'))
      state.itemDraggingOver.item.url = item.texture_url
      evt.target.closest('.q-item').classList.remove('inner-border')
    }
    const onDragover = (reel, item, target) => {
      state.itemDraggingOver = { reel, item }
      target.closest('.q-item').classList.add('inner-border')
    }
    const onDragleave = (el) => {
      el.closest('.q-item').classList.remove('inner-border')
    }
    const onClick = (reel, item) => {
    //   const active = item[`reel${reel}`];
      if (reel === 3) {
        item.reel1 = false
        item.reel2 = false
      } else if (reel === 2) {
        item.reel1 = false
        item.reel2 = true
      } else {
        item.reel1 = true
        item.reel2 = true
      }
    }
    onMounted(async () => {
      state.symbols = await getSymbols()
    })
    return {
      ...toRefs(state), onDrop, onDragover, onDragleave, onClick
    }
  }
}
</script>

<style lang="scss">
@import '../css/app.sass';
.inner-border {
       background-color: rgb(236, 243, 236);
    }
.pay-table{
    display: flex;
    flex-direction: row;
    .items-section{
        amax-height: calc(100vh - #{$header-height} - 85px);
        aoverflow: auto;
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
}
</style>
