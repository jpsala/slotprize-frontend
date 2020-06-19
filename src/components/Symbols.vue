<template>
<div class="items">

    <q-card v-for="item in items" :key="item.id" class="item"
                    :class="{active: item === selectedItem}"
                    @mouseenter="hover(item, $event)" @mouseleave="hover(item, $event)">
        <div class="menu-item">
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
      <q-card-section>
        <div class="text-h6">{{item.payment_type}}</div>
        <div class="texture_url">{{item.texture_url}}</div>
      </q-card-section>

    </q-card>
</div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import { delItem as slotDelItem } from '../services/slot';

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      selectedItem: undefined,
      menuVisible: true,
    });
    console.log('props', props);
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
        console.log('del');
        emit('del', item);
      }
    };
    return { ...toRefs(state), hover, delItem };
  },
};
</script>

<style lang="scss">
.items{
    display: flex;
    flex-wrap: wrap;
    .item{
        margin: 6px;
        width: 200px;
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
        // margin: 2px;
        // border-radius: 5px;
        // border: 2px solid rgb(169, 169, 207);
        // padding: 5px;
        // flex: 1 1 180px;
        // width: 50px;
        // overflow: hidden;
        // max-height: 80px;
        // &:hover{
        //     overflow: auto;
        // }
    }
}
</style>
