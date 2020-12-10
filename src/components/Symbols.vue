<template>
  <div class="items small-scrollbar relative-position small-scrollbars">
    <SymbolDialog
      :symbol="selected"
      @close="symbolClose"
      @cancel="symbolCancel"
    />
    <q-list bordered>
      <q-item
        @click="selected = symbolNew"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            size="40px"
            name="add"
          />
        </q-item-section>
        <q-item-section avatar>
          <span
            class="bg-primary text-white"
            style="padding: 4px 20px; border-radius: 5px"
          >
            New
          </span>
        </q-item-section>
      </q-item>
      <q-item
        @click="setSelected(item, $event)"
        v-for="item in sortedItems"
        :key="item.id"
        clickable
        v-ripple
      >
        <q-icon
          v-show="showRemove(item)"
          @click="$emit('remove', item)"
          class="remove"
          name="remove_circle_outline"
          size="30px"
          color="red-5"
        />
        <q-item-section avatar>
          <q-img
            color="teal"
            :src="item.textureUrl"
          />
        </q-item-section>
        <q-item-section>{{ item.symbolName }} ({{ item.paymentType }})</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import {
  // eslint-disable-next-line no-unused-vars
  reactive, toRefs, watch, computed
} from '@vue/composition-api'
import SymbolDialog from '../components/SymbolDialog'
import axios from '../services/axios'

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
    showPaymentType: { default: () => false },
    payTable: { default: () => [] }
  },
  setup (props, { emit, root }) {
    const state = reactive({
      selectedItem: undefined,
      menuVisible: true,
      selected: undefined,
      symbolNew: { textureUrl: '', paymentType: '', symbolName: '', id: -1 }
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
    // eslint-disable-next-line no-unused-vars
    const setItemsStyle = (_items) => {
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
    const symbolClose = async (data) => {
      const { symbol, files } = data
      const fd = new FormData()
      fd.append('id', symbol.id)
      fd.append('payment_type', symbol.paymentType)
      fd.append('symbol_name', symbol.symbolName)
      fd.append('texture_url', symbol.textureUrl)
      if (files.length > 0) { fd.append('image', files[0]) }
      const axiosAnt = axios.defaults.headers.post['Content-Type']
      axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
      const response = await axios({
        method: 'post',
        url: 'slot/symbol',
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      axios.defaults.headers.post['Content-Type'] = axiosAnt
      emit('save-symbol', response.data)
      state.selected = undefined
    }
    const setSelected = (item, event) => {
      if (event.target.tagName === 'I') return
      state.selected = item
    }
    const showRemove = (symbol) => {
      const used = props.payTable.find(ptItem => ptItem.symbolId === symbol.id)
      return used === undefined
    }
    const symbolCancel = () => {
      state.selected = undefined
    }
    const sortedItems = computed(() => {
      if (!props.items) return []
      function compare (a, b) {
        if (a.symbolName < b.symbolName) { return -1 }
        if (a.symbolName > b.symbolName) { return 1 }
        return 0
      }

      // eslint-disable-next-line vue/no-mutating-props
      return props.items.sort(compare)
    })
    // watch(() => props.items, setItemsStyle)
    return {
      ...toRefs(state), hover, symbolClose, sortedItems, symbolCancel, setSelected, showRemove
    }
  }
}
</script>

<style lang="scss">
.items{
  .q-item .remove{
    position:absolute; right: 0px; top: 8px;
    display: none;
  }
  .q-item:hover>.remove {
    display: block;
  }
  width: 230px;
  min-height: 90vh;
  overflow-y: auto;
}
</style>
