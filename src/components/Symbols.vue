<template>
<div class="items small-scrollbar relative-position">
    <q-btn round color="primary" icon="icon-user" />
    <q-card v-for="item in items" :key="item.id" class="item" draggable='true'
                    :class="{active: item === selectedItem}"
                    @mouseenter="hover(item, $event)" @mouseleave="hover(item, $event)"
                    @dragstart="startDrag($event, item)">
        <div v-if="showMenu" class="menu-item">
            <q-btn round color="primary" icon="more_vert" flat
                            v-show="item === selectedItem">
        <q-menu>
            <q-list style="min-width: 100px">
            <q-item @click="delItem(item)" clickable v-close-popup>
                <q-item-section>Delete from DB</q-item-section>
            </q-item>
            <q-item @click="delItem(item, true)" clickable v-close-popup>
                <q-item-section>Delete File</q-item-section>
            </q-item>
            </q-list>
        </q-menu>
        </q-btn>
        </div>
        <img :src="item.texture_url">
        <q-card-section v-if="showPaymentType || showUrl">
        <div v-if="showPaymentType" class="text-h6">{{item.payment_type}}</div>
        <div v-if="showUrl" class="texture_url">{{item.texture_url}}</div>
        </q-card-section>
    </q-card>
</div>
</template>

<script>
import {
  reactive, toRefs, watch,
} from '@vue/composition-api';
import { delItem as slotDelItem } from '../services/slot';

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    symbolSize: { default: () => '80px' },
    showUrl: { default: () => false },
    showMenu: { default: () => true },
    wrap: { default: () => true },
    direction: { default: 'column' },
    showPaymentType: { default: () => false },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectedItem: undefined,
      menuVisible: true,
    });
    const hover = (item, e) => {
      const isEnter = e.type === 'mouseenter';
      // eslint-disable-next-line no-unused-vars
      const { target } = e;
      if (isEnter) {
        state.selectedItem = item;
        // target.style.overflow = 'auto';
      } else {
        // state.selectedItem = undefined;
        // target.style.overflow = 'hidden';
      }
    };
    const delItem = async (item, file = false) => {
      const resp = await slotDelItem(item.id, file);
      if (+resp.symbols > 0) {
        emit('del', item);
      }
    };
    const setItemsStyle = (_items) => {
      console.log('items', _items);
      const itemsParent = document.querySelector('.items');
      itemsParent.style.flexWrap = props.wrap ? 'wrap' : '';
      itemsParent.style.flexDirection = props.direction;
      //   itemsParent.style.
      if (props.direction === 'row') itemsParent.style.alignContent = 'flex-start';
      const items = document.querySelectorAll('.items .item');
      // eslint-disable-next-line no-unused-vars
      items.forEach((_item) => {
        // _item.style.width = props.symbolSize;
        // _item.style.height = props.symbolSize;
      });
    };
    const startDrag = (evt, item) => {
      evt.dataTransfer.dropEffect = 'move';
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('item', JSON.stringify(item));
      console.log('startDrag', evt, item);
    };
    watch(() => props.items, setItemsStyle);
    return {
      ...toRefs(state), hover, delItem, startDrag,
    };
  },
};
</script>

<style lang="scss">
.items{
    display: flex;
    align-self: baseline;
    .item{
        margin: 4px;
        width: 50px;
        height: 50px;
        .texture_url{
            word-wrap: break-word;
        }
        .menu-item{
            min-height: 20px;
            position: absolute;
            top: 4px;
            left: 1px;
            cursor: pointer;
        }
        &.active{
            border: 1px solid lightblue;
            background-color: rgb(237, 251, 255);
        }
    }
}
</style>
