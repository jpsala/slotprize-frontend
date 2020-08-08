<template>
<div class="items small-scrollbar relative-position">
  <SymbolDialog :symbol="selected"/>
  <q-list bordered>
      <q-item @click="selected = symbolNew" clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="primary" size="40px" name="add" />
        </q-item-section>
        <q-item-section avatar>
          <span  class="bg-primary text-white" style="padding: 4px 20px; border-radius: 5px">
            New
          </span>
        </q-item-section>
      </q-item>
      <q-item @click="selected = item" v-for="item in items" :key="item.id" clickable v-ripple>
        <q-item-section avatar>
          <q-img color="teal" :src="item.textureUrl" />
        </q-item-section>

        <q-item-section>{{item.paymentType}}</q-item-section>
      </q-item>
  </q-list>
</div>
</template>

<script>
import {
  // eslint-disable-next-line no-unused-vars
  reactive, toRefs, watch
} from '@vue/composition-api'
import { delItem as slotDelItem } from '../services/slot'
import SymbolDialog from '../components/SymbolDialog'

export default {
  components: { SymbolDialog },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    symbolSize: { default: () => '80px' },
    showUrl: { default: () => false },
    showMenu: { default: () => true },
    wrap: { default: () => true },
    direction: { default: 'column' },
    showPaymentType: { default: () => false }
  },
  setup (props, { emit }) {
    const state = reactive({
      selectedItem: undefined,
      menuVisible: true,
      selected: undefined,
      symbolNew: { textureUrl: '', paymentType: '', id: -1 }
    })
    const hover = (item, e) => {
      const isEnter = e.type === 'mouseenter'
      // eslint-disable-next-line no-unused-vars
      const { target } = e
      if (isEnter) {
        state.selectedItem = item
        // target.style.overflow = 'auto';
      } else {
        // state.selectedItem = undefined;
        // target.style.overflow = 'hidden';
      }
    }
    const delItem = async (item, file = false) => {
      const resp = await slotDelItem(item.id, file)
      if (+resp.symbols > 0) {
        emit('del', item)
      }
    }
    // eslint-disable-next-line no-unused-vars
    const setItemsStyle = (_items) => {
      console.log('items', _items)
      const itemsParent = document.querySelector('.items')
      itemsParent.style.flexWrap = props.wrap ? 'wrap' : ''
      itemsParent.style.flexDirection = props.direction
      //   itemsParent.style.
      if (props.direction === 'row') itemsParent.style.alignContent = 'flex-start'
      const items = document.querySelectorAll('.items .item')
      // eslint-disable-next-line no-unused-vars
      items.forEach((_item) => {
        // _item.style.width = props.symbolSize;
        // _item.style.height = props.symbolSize;
      })
    }
    const startDrag = (evt, item) => {
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('item', JSON.stringify(item))
      console.log('startDrag', evt, item)
    }
    // watch(() => props.items, setItemsStyle)
    return {
      ...toRefs(state), hover, delItem, startDrag
    }
  }
}
</script>

<style lang="scss">
.items{
    max-height: 90vh;
    overflow-y: auto;
}
</style>
